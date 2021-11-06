'use strict'

const path = require('path')

const Discord = require('discord.js')

const Config = require('./Config');

class Bot
{
	static Intents = Discord.Intents

	/**
	 * @type {Discord.Client|null}
	 */
	client = null

	#defaultOptions = {
		absPath: ABSPATH !== undefined ? ABSPATH : __dirname,
		config: null,
		configFile: "config.json",
		token: null,
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

		Array.of(
			'absPath',
			'token',
		).forEach(key =>
			{
				if (options[key])
					this.config[key] = options[key]
			})

		// Initialize client
		this.client = new Discord.Client(discordJsOptions || options)

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

				// Do something...
				console.log(message)
			})
	}
}

module.exports = Bot
