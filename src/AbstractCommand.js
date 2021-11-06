'use strict';

const Discord = require('discord.js');
const Bot = require('./Bot');

class AbstractCommand
{
	/**
	 * @type {string}
	 */
	name = undefined

	/**
	 * @type {string}
	 */
	description = undefined

	/**
	 * @type {Bot}
	 */
	_bot = undefined

	static create(bot = undefined)
	{
		const instance = new this()
		instance.#setBot(bot)
		return instance
	}

	/**
	 * @param {string} name
	 */
	constructor(name)
	{
		this.name = name
	}

	/**
	 * Check that the command in enabled in this context
	 * @param {Discord.Message} message
	 */
	isEnabled(message)
	{
		return true
	}

	/**
	 * Check that the message author has required permissions
	 * @param {Discord.Message} message
	 */
	isAllowed(message)
	{
		return true
	}

	/**
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	async execute(message, args)
	{
		throw new Error('You have to implement the method execute!')
	}

	/**
	 * @param {Bot} bot
	 */
	#setBot(bot)
	{
		this._bot = bot
	}
}

module.exports = AbstractCommand
