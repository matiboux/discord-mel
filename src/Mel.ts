import fs from 'fs'
import path from 'path'

import Discord from 'discord.js'
import { REST } from '@discordjs/rest'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import IOptions from './config/IOptions'
import Options from './config/Options'
import Translator from './Translator'
import Services from './Services'
import AbstractState from './state/AbstractState'
import IBaseDB from './state/db/IBaseDB'
import Logger from './logger/Logger'
import HooksManager from './hooks/HooksManager'
import DefaultConfig from './config/DefaultConfig'
import unserialize from './functions/unserialize'
import ReadyEventSubscriber from './events/ReadyEventSubscriber'
import EventSubscriber from './events/EventSubscriber'
import InteractionCreateEventSubscriber from './events/InteractionCreateEventSubscriber'
import MessageCreateEventSubscriber from './events/MessageCreateEventSubscriber'
import ErrorEventSubscriber from './events/ErrorEventSubscriber'
import ServicesManager from './services/ServicesManager'
import Service from './services/Service'
import ClockService from './services/ClockService'
import ListenersManager from './listeners/ListenersManager'

class Mel
{
	public static Intents = Discord.Intents

	public static Services = Services

	public static readonly defaultOptions: IOptions = new Options(
		{
			absPath: __dirname,
			configFile: 'config.json',
		})

	public readonly startTimestamp: number

	public config: DefaultConfig

	public logger: Logger

	public translator: Translator

	public client: Discord.Client

	public rest: REST | null = null

	public state: AbstractState<IBaseDB>

	public readonly commands: CommandsCollection

	public readonly hooks: HooksManager

	public readonly services: ServicesManager

	public readonly listeners: ListenersManager

	public constructor(userOptions: IOptions, discordJsOptions: Discord.ClientOptions)
	{
		const options = new Options(Mel.defaultOptions, userOptions)

		this.startTimestamp = Date.now()

		// Load configuration
		this.config = new Mel.Services.Config()
		if (!options.configPath && options.configFile)
		{
			options.configPath = path.join(options.absPath, options.configFile)
		}
		this.config.loadConfigFile(options.configPath)

		const optionConfig = options.config
		const optionLogger = options.logger

		// Merge configuration with options
		delete options.config
		delete options.logger
		unserialize(this.config, options)

		// Override configuration
		if (optionConfig)
		{
			unserialize(this.config, optionConfig)
		}

		// Initialize logger
		if (optionLogger !== undefined)
		{
			this.logger = optionLogger
		}
		else
		{
			if (!this.config.logPath && this.config.logFile)
				this.config.logPath = path.join(this.config.absPath, this.config.logFile)
			this.logger = new Logger(this.config.logPath)
		}

		if (this.config.logLevel !== undefined)
		{
			this.logger.setLevel(this.config.logLevel)
		}

		// Load src and user translations
		this.translator = new Translator(this)
		this.translator.addTranslations(path.join(__dirname, "../translations"), this.config.defaultLanguage)
		if (this.config.translationsDir)
		{
			this.translator.addTranslations(path.join(this.config.absPath, this.config.translationsDir))
		}

		// Load state
		if (!this.config.statePath && this.config.stateFile)
		{
			this.config.statePath = path.join(this.config.absPath, this.config.stateFile)
		}
		this.state = new Mel.Services.State(this.config.statePath)

		// Initialize client
		this.client = new Discord.Client(discordJsOptions)

		// Initialize commands manager
		this.commands = new CommandsCollection(this)

		// Initialize hooks manager
		this.hooks = new HooksManager(this)

		// Initialize services manager
		this.services = new ServicesManager(this)

		// Initialize services manager
		this.listeners = new ListenersManager(this)

		// Load commands
		this.reloadCommands()

		// Load Mel event subscribers
		this.loadEventSubscriber(ReadyEventSubscriber)
		this.loadEventSubscriber(InteractionCreateEventSubscriber)
		this.loadEventSubscriber(MessageCreateEventSubscriber)
		this.loadEventSubscriber(ErrorEventSubscriber)

		// Attach Discord client events to hooks
		let discordRegisteredEvents = 0
		Array.of(
			'apiRequest',
			'apiResponse',
			'applicationCommandCreate',
			'applicationCommandDelete',
			'applicationCommandUpdate',
			'channelCreate',
			'channelDelete',
			'channelPinsUpdate',
			'channelUpdate',
			'debug',
			'emojiCreate',
			'emojiDelete',
			'emojiUpdate',
			'error',
			'guildBanAdd',
			'guildBanRemove',
			'guildCreate',
			'guildDelete',
			'guildIntegrationsUpdate',
			'guildMemberAdd',
			'guildMemberAvailable',
			'guildMemberRemove',
			'guildMembersChunk',
			'guildMemberUpdate',
			'guildUnavailable',
			'guildUpdate',
			'interactionCreate',
			'invalidated',
			'invalidRequestWarning',
			'inviteCreate',
			'inviteDelete',
			'messageCreate',
			'messageDelete',
			'messageDeleteBulk',
			'messageReactionAdd',
			'messageReactionRemove',
			'messageReactionRemoveAll',
			'messageReactionRemoveEmoji',
			'messageUpdate',
			'presenceUpdate',
			'rateLimit',
			'ready',
			'roleCreate',
			'roleDelete',
			'roleUpdate',
			'shardDisconnect',
			'shardError',
			'shardReady',
			'shardReconnecting',
			'shardResume',
			'stageInstanceCreate',
			'stageInstanceDelete',
			'stageInstanceUpdate',
			'stickerCreate',
			'stickerDelete',
			'stickerUpdate',
			'threadCreate',
			'threadDelete',
			'threadListSync',
			'threadMembersUpdate',
			'threadMemberUpdate',
			'threadUpdate',
			'typingStart',
			'userUpdate',
			'voiceStateUpdate',
			'warn',
			'webhookUpdate',
		).forEach(eventName =>
			{
				this.client.on(eventName, this.hooks.get(eventName).callback)
				++discordRegisteredEvents
			})

		this.logger.info(this.translator.translate('events.discordjs.attached', {
				'%count%': discordRegisteredEvents,
			}))

		// Load Mel services
		this.loadService('clock', ClockService, 'ready')
	}

	/**
	 * Start the client
	 *
	 * @param {string|undefined} token
	 */
	public start(token?: string)
	{
		if (!token)
		{
			token = this.config.token
		}

		if (!token)
		{
			return Promise.reject()
		}

		this.rest = new REST({ version: '9' }).setToken(token)
		return this.client.login(token)
			.catch(error =>
				{
					this.logger.error(this.translator.translate('login.fail', {
							'%reason%': error.message
						}))
					return Promise.reject(error)
				})
	}

	/**
	 * Reload commands
	 *
	 * @param {string|null} dirpath
	 * @returns {boolean}
	 */
	private reloadCommands(dirpath: string | null = null): boolean
	{
		if (!dirpath && this.config.commandsDir)
		{
			dirpath = path.join(this.config.absPath, this.config.commandsDir)
		}

		if (dirpath)
		{
			// Clear list of commands
			this.commands.clear()

			// Load commands
			try
			{
				fs.readdirSync(dirpath)
					.filter(file => file.endsWith('.js'))
					.forEach(file =>
						{
							const { default: commandClass }: { default: typeof AbstractCommand | undefined } = require(`${dirpath}/${file}`)

							if (commandClass && commandClass.enabled)
							{
								this.logger.debug(this.translator.translate('commands.load', {
										'%file%': file,
										'%name%': commandClass.name,
									}), 'Mel')

								this.commands.add(commandClass)
							}
							else
							{
								this.logger.debug(this.translator.translate('commands.loadignore', {
										'%name%': file,
									}), 'Mel')
							}
						})

				this.logger.info(this.translator.translate('commands.loaded', {
						'%count%': this.commands.size
					}))

				return true
			}
			catch (error: any)
			{
				if (error.code === 'ENOENT')
				{
					this.logger.warn(this.translator.translate('commands.dir.not_found', {
							'%dir%': dirpath
						}))
				}
				else
				{
					this.logger.error(error)
				}
			}
		}

		return false
	}

	public loadEventSubscriber(eventSubscriberClass: EventSubscriber)
	{
		const eventSubscriber = new eventSubscriberClass(this)

		if (!eventSubscriber.enabled)
		{
			return
		}

		let subcribedHooks = 0

		Object.entries(eventSubscriber.getSubscribedEvents())
			.forEach(([eventName, handlers]) =>
				{
					handlers.forEach(handler =>
						{
							if (typeof handler === 'string')
							{
								const method = (eventSubscriber as any)[handler]
								if (method !== undefined)
								{
									this.hooks.get(eventName).add(
										method.bind(eventSubscriber),
										)
								}
							}
							else
							{
								const method = (eventSubscriber as any)[handler.methodName]
								if (method !== undefined)
								{
									this.hooks.get(eventName).add(
										method.bind(eventSubscriber),
										handler.priority,
										)
								}
							}
						})

					++subcribedHooks
				})

		this.logger.info(this.translator.translate('events.subscriber.loaded', {
				'%name%': eventSubscriberClass.name,
				'%count%': subcribedHooks,
			}))
	}

	public loadService(serviceName: string, serviceClass: Service, enableOnHook?: string, hookPriority?: number): void
	public loadService(serviceName: string, serviceClass: Service, enableNow?: boolean): void
	public loadService(serviceName: string, serviceClass: Service, enableNowOrHook?: string | boolean, hookPriority?: number): void
	{
		// Get the service configuration
		const serviceConfig = this.config.services.get(serviceName)

		const service = new serviceClass(serviceName, serviceConfig, this)
		this.services.add(service)

		if (enableNowOrHook === true)
		{
			// Force enabling the service immediately
			service.enable()
		}
		else if (enableNowOrHook !== false && (serviceConfig === undefined || serviceConfig.enabled === true))
		{
			if (enableNowOrHook)
			{
				// Enable service on fired hook
				this.hooks.get(enableNowOrHook).add(service.enable.bind(service), hookPriority)
			}
			else
			{
				// Apply the default behavior and enable the service immediately
				service.enable()
			}
		}

		this.logger.info(this.translator.translate('services.loaded', {
				'%name%': serviceClass.name,
			}), 'Services')
	}
}

export default Mel
