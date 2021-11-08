'use strict';

const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Bot = require('../Bot');

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
	 * @type {boolean}
	 */
	guildOnly = false

	/**
	 * @type {string[]}
	 */
	permissions = []

	/**
	 * @type {Bot}
	 */
	_bot

	static create(bot)
	{
		return new this(bot)
	}

	/**
	 * @param {string|undefined} name
	 */
	constructor(bot, name = undefined)
	{
		if (name === undefined)
			throw new Error('You have to specify a command name')

		this._bot = bot
		this.name = name
	}

	get translator()
	{
		return this._bot.translator
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

		return true
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
			if (!this.permissions.every(permission => message.member.permissions.has(permission)))
				return false
		}

		return true
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
	 * @param {Discord.Interaction} interaction
	 */
	async onInteraction(interaction)
	{
		throw new Error('You have to implement the method onInteraction!')
	}

	/**
	 * @param {Discord.Message|Discord.Interaction} object
	 */
	async onNotEnabled(object)
	{
		console.error(this.translator.translate('commands.run.not_enabled', {
				'%name%': this.name
			}))
	}

	/**
	 * @param {Discord.Message|Discord.Interaction} object
	 * @param {boolean} reply
	 */
	async onNotAllowed(object, reply = true)
	{
		if (reply && object.reply)
		{
			const content = this.translator.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		console.error(this.translator.translate('commands.run.not_allowed', {
				'%name%': this.name
			}))
	}

	/**
	 * @param {Discord.Message|Discord.Interaction} object
	 * @param {boolean} reply
	 */
	async onError(object, reply = true)
	{
		if (reply && object.reply)
		{
			const content = this.translator.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		console.error(this.translator.translate('commands.run.error', {
				'%name%': this.name
			}))
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
