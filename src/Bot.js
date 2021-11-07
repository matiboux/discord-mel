'use strict'

const fs = require('fs')
const path = require('path')

const Discord = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { SlashCommandBuilder } = require('@discordjs/builders')

const AbstractCommand = require('./commands/AbstractCommand')
const CommandsCollection = require('./commands/CommandsCollection')
const Config = require('./Config')
const Translator = require('./Translator')

class Bot
{
	static Intents = Discord.Intents

	/**
	 * @type {Discord.Client|null}
	 */
	client = null

	/**
	 * @type {REST|null}
	 */
	rest = null

	/**
	 * @type {CommandsCollection}
	 */
	commands = new CommandsCollection()

	#defaultOptions = {
		absPath: ABSPATH !== undefined ? ABSPATH : __dirname,
		config: null,
		configPath: null,
		configFile: "config.json",
		token: null,
		commandsDir: null,
		translationsDir: null,
		defaultLanguage: null,
		prefix: null,
	}

	constructor(userOptions = {}, discordJsOptions = null)
	{
		const options = {...this.#defaultOptions, ...userOptions}
		if (!options)
			options = this.#defaultOptions

		/** @type {number} */
		this.startTimestamp = Date.now()

		if (options.configFile)
		{
			if (!options.configPath)
				options.configPath = path.join(options.absPath, options.configFile)
			this.config = new Config(options.configPath)
		}

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

		// Load src and user translations
		this.translator = new Translator(path.join(__dirname, "translations"), this.config.defaultLanguage)
		if (this.config.translationsDir)
			this.translator.addTranslations(path.join(this.config.absPath, this.config.translationsDir))

		// Initialize client
		this.client = new Discord.Client(discordJsOptions || options)

		// Load commands
		this.reloadCommands()

		// Load Discord client events
		this.#loadEvents()
	}

	/**
	 * Start the client
	 *
	 * @param {string|null} token
	 */
	start(token = null)
	{
		if (!token)
			token = this.config.token

		this.rest = new REST({ version: '9' }).setToken(token);
		return this.client.login(token)
			.catch(error =>
				{
					console.error(this.translator.translate('login.fail', {
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
	reloadCommands(dirpath = null)
	{
		if (!dirpath && this.config.commandsDir)
			dirpath = path.join(ABSPATH, this.config.commandsDir)

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
							/** @type {AbstractCommand|Object} */
							const commandObject = require(`${dirpath}/${file}`)
							if (commandObject.name !== undefined)
							{
								if (typeof commandObject.create === 'function')
								{
									/** @type {AbstractCommand} */
									const command = commandObject.create(this);
									this.commands.add(command)
								}
								else
								{
									this.commands.add(commandObject)
								}
							}
						})

				console.log(this.translator.translate('commands.loaded', {
						'%count%': this.commands.size
					}))

				return true
			}
			catch (error)
			{
				if (error.code === 'ENOENT')
					console.error(this.translator.translate('commands.dir.not_found', {
							'%dir%': dirpath
						}))
				else
					console.error(error)
			}
		}

		return false
	}

	/**
	 * Load Discord client events
	 */
	#loadEvents()
	{
		this.client.on('ready', () =>
			{
				console.log(this.translator.translate('login.ready', {
						'%user%': this.client.user.tag
					}))

				if (this.rest)
				{
					// Register slash commands in guilds
					this.client.guilds.fetch()
						.then(guilds => guilds.forEach(guild =>
							{
								const slashCommands = []
								this.commands.forEach(command =>
									{
										const slashCommand = command.getApplicationCommand()
										if (slashCommand === undefined) return

										slashCommands.push(slashCommand.toJSON())
									})

								this.rest.put(Routes.applicationGuildCommands(this.client.user.id, guild.id),
								              { body: slashCommands })
									.then(() => console.log(this.translator.translate('commands.guild.registered', {
											'%count%': slashCommands.length
										})))
									.catch(error =>
										{
											console.error(this.translator.translate('commands.guild.fail', {
													'%count%': slashCommands.length
												}))

											if (error.code === 50001)
												console.error(this.translator.translate('scopes.missing.applications.commands'))
											else
												console.error(error)
										})
							}))
						.catch(console.error)
				}
		})

		this.client.on('interactionCreate', async interaction =>
			{
				if (interaction.isCommand() || interaction.isContextMenu())
				{
					/** @type {AbstractCommand} */
					const command = this.commands.get(interaction.commandName)
					let commandExecuted = false

					if (command)
						try
						{
							await command.execute(interaction)
							commandExecuted = true
						}
						catch (error)
						{
							console.error(error)
						}

					if (!commandExecuted)
						await message.reply({
								content: this.translator.translate('commands.run.error')
							})
				}
			})

		this.client.on('messageCreate', async message =>
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
				if (mentionMatch && mentionMatch[1] === this.client.user.id)
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

							return { commandName: content, commandArgs: undefined }
						})()

					/** @type {AbstractCommand} */
					const command = this.commands.get(commandName)
					let commandExecuted = false

					if (command)
						try
						{
							await command.execute(message, commandArgs)
							commandExecuted = true
						}
						catch (error)
						{
							console.error(error)
						}

					if (!commandExecuted)
						await message.reply({
								content: this.translator.translate('commands.run.error')
							})
				}
			})
	}
}

module.exports = Bot
