'use strict';

const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Base = require('../Base');

class AbstractCommand extends Base
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
	 * @type {boolean}
	 */
	guildOnly = false

	/**
	 * @type {boolean}
	 */
	slashCommand = false

	/**
	 * @type {string[]}
	 */
	permissions = []

	static create(bot = undefined)
	{
		const instance = new this()
		instance._setBot(bot)
		return instance
	}

	/**
	 * @param {string} name
	 */
	constructor(name)
	{
		super()

		this.name = name
	}

	/**
	 * Check that the command in enabled in this context
	 * @param {Discord.Message} message
	 */
	isEnabled(message)
	{
		if (this.guildOnly)
		{
			// Check that the message is from a guild member
			if (!message.member)
				return false
		}

		console.log('isEnabled')
		return false
	}

	/**
	 * Check that the message author has required permissions
	 * @param {Discord.Message} message
	 */
	isAllowed(message)
	{
		if (message.member)
		{
			// Check for required member permissions
			if (!this.permissions.every(permission => message.member.hasPermission(permission)))
				return false
		}

		console.log('isAllowed')
		return false
	}

	/**
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	async onMessage(message, args)
	{
		throw new Error('You have to implement the method onMessage!')
	}

	/**
	 * @param {Discord.Integration} interaction
	 */
	async onInteraction(interaction)
	{
		throw new Error('You have to implement the method onInteraction!')
	}

	/**
	 * @returns {SlashCommandBuilder|ContextMenuCommandBuilder}
	 */
	getApplicationCommand()
	{
		return undefined
	}
}

module.exports = AbstractCommand
