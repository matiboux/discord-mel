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

class Bot
{
	public static Intents = Discord.Intents

	public static Services = Services

	public static readonly defaultOptions: IOptions = new Options(
		{
			absPath: __dirname,
			configFile: "config.json",
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

	public constructor(userOptions: IOptions, discordJsOptions: Discord.ClientOptions)
	{
		const options = new Options(Bot.defaultOptions, userOptions)

		this.startTimestamp = Date.now()

		// Load configuration
		if (!options.configPath && options.configFile)
			options.configPath = path.join(options.absPath, options.configFile)
		this.config = new Bot.Services.Config()
		this.config.loadConfigFile(options.configPath)

		// Override configuration
		if (options.config)
			Object.assign(this.config, options.config)

		const ignoredOptionsKeys = ['config']
		Object.entries(options).forEach(([key, value]) =>
			{
				if (!value || ignoredOptionsKeys.includes(key))
					return // Ignore this option

				this.config[key] = value
			})

		// Initialize logger
		if (this.config.logger !== undefined)
			this.logger = new Logger(this.config.logger)
		else
		{
			if (!this.config.logPath && this.config.logFile)
				this.config.logPath = path.join(this.config.absPath, this.config.logFile)
			this.logger = new Logger(this.config.logPath)
		}

		if (this.config.logLevel !== undefined)
			this.logger.setLevel(this.config.logLevel)

		// Load state
		if (!this.config.statePath && this.config.stateFile)
			this.config.statePath = path.join(this.config.absPath, this.config.stateFile)
		this.state = new Bot.Services.State(this.config.statePath)

		// Load src and user translations
		this.translator = new Translator(this)
		this.translator.addTranslations(path.join(__dirname, "../translations"), this.config.defaultLanguage)
		if (this.config.translationsDir)
			this.translator.addTranslations(path.join(this.config.absPath, this.config.translationsDir))

		// Initialize client
		this.client = new Discord.Client(discordJsOptions)

		// Load commands
		this.reloadCommands()

		// Register Mel hooks
		this.hooks.get('debug').add(this.onDebug.bind(this))
		this.hooks.get('error').add(this.onError.bind(this))
		this.hooks.get('ready').add(this.onReady.bind(this))
		this.hooks.get('interactionCreate').add(this.onInteractionCreate.bind(this))
		this.hooks.get('messageCreate').add(this.onMessageCreate.bind(this))
		this.hooks.get('shardError').add(this.onShardError.bind(this))

		// Register Discord client events
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
			// interactionD
			'interactionCreate',
			'invalidated',
			'invalidRequestWarning',
			'inviteCreate',
			'inviteDelete',
			// messageD
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

		this.logger.info(this.translator.translate('events.discordjs.registered', {
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
			token = this.config.token

		if (token)
		{
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

		return Promise.reject()
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
			dirpath = path.join(this.config.absPath, this.config.commandsDir)

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
					this.logger.warn(this.translator.translate('commands.dir.not_found', {
							'%dir%': dirpath
						}))
				else
					this.logger.error(error)
			}
		}

		return false
	}

	private onReady()
	{
		this.logger.info(this.translator.translate('login.ready', {
				'%user%': this.client.user?.tag
			}))

		if (this.rest)
		{
			// Register slash commands in guilds
			this.client.guilds.fetch()
				.then(guilds => guilds.forEach(guild =>
					{
						const slashCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
						this.commands.forEach(command =>
							{
								command.applicationCommands
									.forEach(slashCommand => slashCommands.push(slashCommand.toJSON()))
							})

						if (this.rest)
						{
							const clientId = this.client.user?.id
							if (clientId)
							{
								this.rest.put(Routes.applicationGuildCommands(clientId, guild.id),
											  { body: slashCommands })
									.then(() =>
										{
											this.logger.info(this.translator.translate('commands.guild.registered', {
													'%count%': slashCommands.length
												}))
										})
									.catch(error =>
										{
											this.logger.error(this.translator.translate('commands.guild.fail', {
													'%count%': slashCommands.length
												}))

											if (error.code === 50001)
												this.logger.error(this.translator.translate('scopes.missing.applications.commands'))
											else
												this.logger.error(error)
										})
							}
						}
					}))
				.catch(this.logger.warn)
		}
	}

	private async onInteractionCreate(interaction: Discord.Interaction)
	{
		if (interaction.isApplicationCommand())
		{
			// interaction.isCommand() || interaction.isContextMenu()
			this.commands.onCommandInteraction(interaction)
		}
		else if (interaction.isMessageComponent())
		{
			// interaction.isButton() || interaction.isSelectMenu()
			this.commands.onComponentInteraction(interaction)
		}
		else if (interaction.isAutocomplete())
		{
			this.commands.onAutocompleteInteraction(interaction)
		}
		else
		{
			this.logger.error(this.translator.translate('interaction.unknown', {
					'%type%': interaction.type
				}))
		}
	}

	private async onMessageCreate(message: Discord.Message)
	{
		// Ignore messages from bots
		if (message.author.bot) return

		let isCommand = false
		let content = message.content

		// Check if a command was sent
		if (this.config.prefix && content.startsWith(this.config.prefix))
		{
			isCommand = true
			content = content.slice(this.config.prefix.length)
		}

		// Check if the bot was called for a command
		const mentionMatch = content.match(/^<@!?([^>]+)>\s*(.*)$/is)
		if (mentionMatch && mentionMatch[1] === this.client.user?.id)
		{
			isCommand = true
			content = mentionMatch[2]
		}

		if (isCommand)
		{
			const { commandName, commandArgs } = (() =>
				{
					const commandMatch = content.match(/^([^\s]*)\s*(.*)$/is)
					if (commandMatch)
						return { commandName: commandMatch[1], commandArgs: commandMatch[2] }

					return { commandName: content, commandArgs: '' }
				})()

			this.commands.onMessage(commandName, message, commandArgs)
		}
	}

	private async onDebug(info: string)
	{
		this.logger.debug(info, 'djs.debug')
	}

	private async onError(error: Error)
	{
		this.logger.error(error, 'djs.error')
	}

	private async onShardError(error: Error, shardId: number)
	{
		this.logger.error(error, 'djs.shardError')
	}
}

export default Bot
