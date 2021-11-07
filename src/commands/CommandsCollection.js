'use strict';

const { Collection } = require('discord.js');
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
	 *
	 * @param {string} commandName
	 * @param  {...any} args
	 */
	async onMessage(commandName, ...args)
	{
		const command = this.get(commandName)
		let commandExecuted = false

		if (command)
			try
			{
				await command.onMessage(...args)
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

		return commandExecuted
	}

	/**
	 *
	 * @param {string} commandName
	 * @param  {...any} args
	 */
	async onInteraction(commandName, ...args)
	{
		const command = this.get(commandName)
		let commandExecuted = false

		if (command)
			try
			{
				await command.onInteraction(...args)
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

		return commandExecuted
	}
}

module.exports = CommandsCollection
