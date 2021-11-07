'use strict';

const Discord = require('discord.js')
const Collection = Discord.Collection
const Bot = require('../Bot');
const AbstractCommand = require('./AbstractCommand');

/**
 * @extends {Collection<string, AbstractCommand>}
 */
class CommandsCollection extends Collection
{
	/**
	 * @type {Bot}
	 */
	#bot = undefined

	constructor(bot = undefined)
	{
		super()

		if (bot) this.#setBot(bot)
	}

	/**
	 * @param {Bot} bot
	 */
	#setBot(bot)
	{
		this.#bot = bot
	}

	get translator()
	{
		return this.#bot?.translator
	}

	/**
	 * Add command
	 *
	 * @param {AbstractCommand} command
	 * @returns {this}
	 */
	add(command)
	{
		if (command.name === undefined)
			throw new Error('Invalid command object')

		return this.set(command.name, command)
	}

	/**
	 * @param {string} commandName
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	async onMessage(commandName, message, args)
	{
		const command = this.get(commandName)
		let commandExecuted = false

		if (command)
		{
			try
			{
				await command.onMessage(message, args)
				commandExecuted = true
			}
			catch (error)
			{
				command.onError(message)
				console.error(error)
			}
		}
		else
		{
			console.error(this.translator.translate('commands.run.not_found', {
					'%name%': commandName
				}))
		}

		return commandExecuted
	}

	/**
	 * @param {string} commandName
	 * @param {Discord.Integration} interaction
	 */
	async onInteraction(commandName, interaction)
	{
		const command = this.get(commandName)
		let commandExecuted = false

		if (command)
		{
			try
			{
				await command.onInteraction(interaction)
				commandExecuted = true
			}
			catch (error)
			{
				command.onError(interaction)
				console.error(error)
			}
		}
		else
		{
			console.error(this.translator.translate('commands.run.not_found', {
					'%name%': commandName
				}))
		}

		return commandExecuted
	}
}

module.exports = CommandsCollection
