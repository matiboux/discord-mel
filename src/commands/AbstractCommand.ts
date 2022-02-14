import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders'
import Discord, { PermissionResolvable } from 'discord.js'
import { Translator } from '..'

import Mel from '../Mel'
import Logger from '../logger/Logger'
import AbstractHandler from '../listeners/handler/AbstractHandler'

type ApplicationCommand = SlashCommandBuilder | ContextMenuCommandBuilder

class AbstractCommand
{
	protected bot: Mel
	protected logger: Logger
	protected translator: Translator

	name: string
	description?: string

	/** Command aliases for legacy commands */
	commandAliases: Set<string> = new Set<string>()

	/** Application commands (interactions) */
	applicationCommands: ApplicationCommand[] = []

	/** Components (interactions) */
	componentIds: Set<string> = new Set<string>()

	guildOnly: boolean = false
	permissions: PermissionResolvable[] = []

	handlers: Map<string, AbstractHandler | Map<string, AbstractHandler>> = new Map<string, AbstractHandler | Map<string, AbstractHandler>>()

	static create(bot: Mel)
	{
		return new this(bot)
	}

	constructor(bot: Mel, name?: string)
	{
		if (name === undefined)
			throw new Error('You have to specify a command name')

		this.bot = bot
		this.logger = this.bot?.logger || new Logger()
		this.translator = this.bot?.translator || new Translator()

		this.name = name
	}

	protected get state()
	{
		return this.bot.state
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
	async onMessage(message: Discord.Message, args: string): Promise<void>
	{
		throw new Error('You have to implement the method onMessage!')
	}

	async onCommandInteraction(interaction: Discord.BaseCommandInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onCommandInteraction!')
	}

	async onComponentInteraction(interaction: Discord.MessageComponentInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onComponentInteraction!')
	}

	async onAutocompleteInteraction(interaction: Discord.AutocompleteInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onAutocompleteInteraction!')
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 */
	async onNotEnabled(object: Discord.Message | Discord.Interaction)
	{
		this.logger.warn(this.translator?.translate('commands.run.not_enabled', {
				'%name%': this.name
			}), this.constructor.name)
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

		this.logger.warn(this.translator?.translate('commands.run.not_allowed', {
				'%name%': this.name
			}), this.constructor.name)
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

		this.logger.error(this.translator?.translate('commands.run.error', {
				'%name%': this.name
			}), this.constructor.name)
	}
}

export default AbstractCommand
