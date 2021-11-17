import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders'
import Discord, { PermissionResolvable } from 'discord.js'

import Bot from '../Bot'
import Logger from '../logger/Logger'

type ApplicationCommand = SlashCommandBuilder | ContextMenuCommandBuilder

class AbstractCommand
{
	name: string

	description?: string

	guildOnly: boolean = false

	permissions: PermissionResolvable[] = []

	protected bot: Bot
	protected logger: Logger

	static create(bot: Bot)
	{
		return new this(bot)
	}

	constructor(bot: Bot, name?: string)
	{
		if (name === undefined)
			throw new Error('You have to specify a command name')

		this.bot = bot
		this.logger = bot.logger
		this.name = name
	}

	get translator()
	{
		return this.bot.translator
	}

	/**
	 * Check that the command in enabled in this context
	 * @param {Discord.Message | Discord.Interaction} message
	 */
	isEnabled(message: Discord.Message | Discord.Interaction)
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
	 * @param {Discord.Message | Discord.Interaction} message
	 */
	isAllowed(message: Discord.Message | Discord.Interaction)
	{
		if (message.member)
		{
			// Check for required member permissions
			if (!this.permissions.every(permission =>
					{
						let permissions = message.member?.permissions
						if (!permissions) return false

						if (typeof permissions === 'string')
							permissions = new Discord.Permissions(permissions as `${bigint}`)

						return permissions.has(permission)
					}))
				return false
		}

		return true
	}

	/**
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	async onMessage(message: Discord.Message, args: string)
	{
		throw new Error('You have to implement the method onMessage!')
	}

	/**
	 * @param {Discord.Interaction} interaction
	 */
	async onInteraction(interaction: Discord.Interaction)
	{
		throw new Error('You have to implement the method onInteraction!')
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 */
	async onNotEnabled(object: Discord.Message | Discord.Interaction)
	{
		console.error(this.translator?.translate('commands.run.not_enabled', {
				'%name%': this.name
			}))
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 * @param {boolean} reply
	 */
	async onNotAllowed(object: Discord.Message | Discord.Interaction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.BaseCommandInteraction))
		{
			const content = this.translator?.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		console.error(this.translator?.translate('commands.run.not_allowed', {
				'%name%': this.name
			}))
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 * @param {boolean} reply
	 */
	async onError(object: Discord.Message | Discord.Interaction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.BaseCommandInteraction))
		{
			const content = this.translator?.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		console.error(this.translator?.translate('commands.run.error', {
				'%name%': this.name
			}))
	}

	/**
	 * @returns {ApplicationCommand | undefined}
	 */
	getApplicationCommand(): ApplicationCommand | undefined
	{
		return undefined
	}

	getApplicationCommands(): ApplicationCommand[]
	{
		return []
	}
}

export default AbstractCommand
