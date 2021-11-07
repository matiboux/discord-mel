'use strict';

const { Collection } = require('discord.js');
const AbstractCommand = require('./AbstractCommand');

class CommandsCollection extends Collection
{
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
