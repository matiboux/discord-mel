'use strict'

const fs = require('fs')
const path = require('path')

const Discord = require('discord.js')
const Collection = Discord.Collection

const Config = require('./Config');
const AbstractCommand = require('./AbstractCommand');

class Bot
{
	static Intents = Discord.Intents

	/**
	 * @type {Discord.Client|null}
	 */
	client = null

	/**
	 * @type {Collection}
	 */
	commands = undefined

	#defaultOptions = {
		absPath: ABSPATH !== undefined ? ABSPATH : __dirname,
		config: null,
		configFile: "config.json",
		token: null,
		commandsDir: null,
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
			const configPath = path.join(options.absPath, options.configFile)
			this.config = new Config(configPath)
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

		if (token)
			try {
				return this.client.login(token)
			}
			catch (e) {
				console.error('Failed to login')
				console.error(e)
			}

		return Promise.reject();
	}

	/**
	 * Reload commands
	 *
	 * @param {string|null} dirpath
	 */
	reloadCommands(dirpath = null)
	{
		if (!dirpath && this.config.commandsDir)
			dirpath = path.join(ABSPATH, this.config.commandsDir)

		// Load commands
		this.commands = new Collection()
		if (dirpath)
			try
			{
				fs.readdirSync(dirpath)
					.filter(file => file.endsWith('.js'))
					.forEach(file => {
						/** @type {AbstractCommand|Object} */
						const commandObject = require(`${dirpath}/${file}`)
						if (commandObject.name !== undefined)
						{
							if (typeof commandObject.create === 'function')
							{
								/** @type {AbstractCommand} */
								const command = commandObject.create(this);
								this.commands.set(command.name, command)
							}
							else
							{
								this.commands.set(commandObject.name, commandObject)
							}
						}
					})
			}
			catch (error)
			{
				console.error(error)
			}
		console.log(`Loaded ${this.commands.size} commands.`)
	}

	/**
	 * Load Discord client events
	 */
	#loadEvents()
	{
		this.client.on('ready', () =>
			{
				console.log(`Logged in as ${this.client.user.tag}!`)
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
						await message.reply({ content: this.translator.translate('There was an error while executing this command!') })
				}
			})
	}
}

module.exports = Bot
