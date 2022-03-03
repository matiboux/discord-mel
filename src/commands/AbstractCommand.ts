import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders'
import Discord, { PermissionResolvable } from 'discord.js'

import Mel from '../Mel'
import AbstractHandler from '../listeners/handler/AbstractHandler'

type ApplicationCommand = SlashCommandBuilder | ContextMenuCommandBuilder

class AbstractCommand
{
	public static readonly enabled: boolean = false

	public readonly id: string
	public readonly bot: Mel

	public readonly name?: string
	public readonly description?: string

	/** Command aliases for legacy commands */
	public readonly commandAliases: Set<string> = new Set<string>()

	/** Application commands (interactions) */
	public readonly applicationCommands: Set<ApplicationCommand> = new Set<ApplicationCommand>()

	/** Components (interactions) */
	public readonly componentIds: Set<string> = new Set<string>()

	public readonly guildOnly: boolean = false
	public readonly permissions: Set<PermissionResolvable> = new Set<PermissionResolvable>()

	/** Listerners handlers */
	public readonly handlers: Map<string, AbstractHandler | Map<string, AbstractHandler>> = new Map<string, AbstractHandler | Map<string, AbstractHandler>>()

	constructor(id: string, bot: Mel)
	{
		this.id = id
		this.bot = bot
	}

	/**
	 * Check that the command in enabled in this context
	 * @param {Discord.Message | Discord.Interaction} message
	 */
	public isEnabled(message: Discord.Message | Discord.Interaction)
	{
		if (this.guildOnly)
		{
			// Check that the message is from a guild member
			if (!message.member)
			{
				return false
			}
		}

		return true
	}

	/**
	 * Check that the message author has required permissions
	 * @param {Discord.Message | Discord.Interaction} message
	 */
	public isAllowed(message: Discord.Message | Discord.Interaction)
	{
		if (message.member)
		{
			// Check for required member permissions
			const permissionsCheck = Array.from(this.permissions).every(permission =>
				{
					let permissions = message.member?.permissions
					if (!permissions)
					{
						return false
					}

					if (typeof permissions === 'string')
					{
						permissions = new Discord.Permissions(permissions as `${bigint}`)
					}

					return permissions.has(permission)
				})
			if (!permissionsCheck)
			{
				return false
			}
		}

		return true
	}

	/**
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	public async onMessage(message: Discord.Message, args: string): Promise<void>
	{
		throw new Error('You have to implement the method onMessage!')
	}

	public async onCommandInteraction(interaction: Discord.BaseCommandInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onCommandInteraction!')
	}

	public async onComponentInteraction(interaction: Discord.MessageComponentInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onComponentInteraction!')
	}

	public async onAutocompleteInteraction(interaction: Discord.AutocompleteInteraction): Promise<void>
	{
		throw new Error('You have to implement the method onAutocompleteInteraction!')
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 */
	public async onNotEnabled(object: Discord.Message | Discord.Interaction)
	{
		this.bot.logger.warn(this.bot.translator?.translate('commands.run.not_enabled', {
				'%name%': this.name
			}), this.constructor.name)
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 * @param {boolean} reply
	 */
	public async onNotAllowed(object: Discord.Message | Discord.Interaction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.BaseCommandInteraction))
		{
			const content = this.bot.translator?.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		this.bot.logger.warn(this.bot.translator?.translate('commands.run.not_allowed', {
				'%name%': this.name
			}), this.constructor.name)
	}

	/**
	 * @param {Discord.Message | Discord.Interaction} object
	 * @param {boolean} reply
	 */
	public async onError(object: Discord.Message | Discord.Interaction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.BaseCommandInteraction))
		{
			const content = this.bot.translator?.translate('commands.reply.not_allowed')
			if (content)
				object.reply({ content, ephemeral: true })
		}

		this.bot.logger.error(this.bot.translator?.translate('commands.run.error', {
				'%name%': this.name
			}), this.constructor.name)
	}
}

export default AbstractCommand
