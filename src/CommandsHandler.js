'use strict';

const { Collection } = require('discord.js');
const AbstractCommand = require('./AbstractCommand');

class CommandsHandler
{
	/**
	 * @type {Collection<string, AbstractCommand>}
	 */
	commands = undefined

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

		this.commands.set(command.name, command)
		return this
	}

	/**
	 * Gets the number of commands
	 *
	 * @returns {number}
	 */
	get size()
	{
		return this.commands.size
	}

	/**
	 * Get a command
	 *
	 * @param {string} commandName
	 * @returns {AbstractCommand}
	 */
	get(commandName)
	{
		return this.commands.get(commandName)
	}

	/**
	 * Remove command by name
	 *
	 * @param {string} commandName
	 * @returns {boolean}
	 */
	removeByName(commandName)
	{
		return this.commands.delete(commandName)
	}

	/**
	 * Remove all commands
	 *
	 * @returns {boolean}
	 */
	removeAll()
	{
		this.commands = new Collection()
		return true
	}
}

module.exports = CommandsHandler
