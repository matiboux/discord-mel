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
}

module.exports = CommandsCollection
