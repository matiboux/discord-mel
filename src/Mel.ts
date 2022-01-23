import fs from 'fs'
import path from 'path'

import Discord from 'discord.js'
import { REST } from '@discordjs/rest'
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import IOptions from './config/IOptions'
import Options from './config/Options'
import Translator from './Translator'
import Services from './Services'
import AbstractState from './state/AbstractState'
import IBaseStateType from './state/DefaultStateType'
import Logger from './logger/Logger'
import HooksManager from './hooks/HooksManager'
import DefaultConfig from './config/DefaultConfig'
import assignDeep from './functions/assignDeep'
import ReadyEventSubscriber from './events/ReadyEventSubscriber'
import EventSubscriber from './events/EventSubscriber'
import InteractionCreateEventSubscriber from './events/InteractionCreateEventSubscriber'
import MessageCreateEventSubscriber from './events/MessageCreateEventSubscriber'
import ErrorEventSubscriber from './events/ErrorEventSubscriber'
import ServicesManager from './services/ServicesManager'

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

	public client: Discord.Client

	public rest: REST | null = null

	public state: AbstractState<IBaseStateType, IBaseStateType>

	public commands: CommandsCollection = new CommandsCollection(this)

	public translator: Translator

	public readonly hooks: HooksManager = new HooksManager(this)

	public readonly services: ServicesManager = new ServicesManager(this)

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
		assignDeep(this.config, options)

		// Override configuration
		if (optionConfig)
		{
			assignDeep(this.config, optionConfig)
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

		// Load state
		if (!this.config.statePath && this.config.stateFile)
		{
			this.config.statePath = path.join(this.config.absPath, this.config.stateFile)
		}
		this.state = new Mel.Services.State(this.config.statePath)

		// Load src and user translations
		this.translator = new Translator(this)
		this.translator.addTranslations(path.join(__dirname, "../translations"), this.config.defaultLanguage)
		if (this.config.translationsDir)
		{
			this.translator.addTranslations(path.join(this.config.absPath, this.config.translationsDir))
		}

		// Initialize client
		this.client = new Discord.Client(discordJsOptions)

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
							const { default: commandObject }: { default: typeof AbstractCommand } = require(`${dirpath}/${file}`)
							const command = commandObject.create(this)
							this.commands.add(command)
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
}

export default Mel
