import { SlashCommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders'
import Discord, { PermissionResolvable } from 'discord.js'

import Mel from '../Mel.js'
import AbstractHandler from '../listeners/handler/AbstractHandler.js'

type ApplicationCommand = SlashCommandBuilder | ContextMenuCommandBuilder

class AbstractCommand
{
	public static readonly enabled: boolean = false

	public readonly id: string
	public readonly bot: Mel

	public name?: string
	public description?: string

	/** Command aliases for legacy commands */
	public readonly commandAliases: Set<string> = new Set<string>()

	/** Application commands (interactions) */
	public readonly applicationCommands: Set<ApplicationCommand> = new Set<ApplicationCommand>()

	/** Components (interactions) */
	public readonly componentIds: Set<string> = new Set<string>()

	public guildOnly: boolean = false
	public permissions: Discord.PermissionsBitField = new Discord.PermissionsBitField()

	/** Listerners handlers */
	public readonly handlers: Map<string, AbstractHandler | Map<string, AbstractHandler>> = new Map<string, AbstractHandler | Map<string, AbstractHandler>>()

	public constructor(id: string, bot: Mel)
	{
		this.id = id
		this.bot = bot
	}

	/**
	 * Check that the command in enabled in this context
	 * @param {Discord.Message | Discord.BaseInteraction} message
	 */
	public isEnabled(message: Discord.Message | Discord.BaseInteraction)
	{
		if (this.guildOnly && !message.guild)
		{
			// The command is guild only
			return false
		}

		return true
	}

	/**
	 * Check that the message author has required permissions
	 * @param {Discord.Message | Discord.BaseInteraction} message
	 */
	public isAllowed(message: Discord.Message | Discord.BaseInteraction)
	{
		// Allow if no permissions are required
		if (this.permissions.bitfield === 0n)
		{
			return true
		}

		// TODO: Verify which permissions to check
		// Currently: for messages we check guild permissions, for interactions we check channel permissions
		const permissions = (message instanceof Discord.Message ? message.member?.permissions : message.memberPermissions) ?? undefined

		// Allow if member has all required permissions
		// Check that no required permission is missing from the member permissions
		return permissions && permissions.missing(this.permissions).length <= 0
	}

	/**
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	public async onMessage(message: Discord.Message, args: string): Promise<void>
	{
		throw new Error('You have to implement the method onMessage!')
	}

	public async onCommandInteraction(interaction: Discord.CommandInteraction): Promise<void>
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
	 * @param {Discord.Message | Discord.BaseInteraction} object
	 */
	public async onNotEnabled(object: Discord.Message | Discord.BaseInteraction)
	{
		this.bot.logger.warn(this.bot.translator?.translate('commands.run.not_enabled', {
				'%name%': this.name
			}), this.constructor.name)
	}

	/**
	 * @param {Discord.Message | Discord.BaseInteraction} object
	 * @param {boolean} reply
	 */
	public async onNotAllowed(object: Discord.Message | Discord.BaseInteraction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.CommandInteraction))
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
	 * @param {Discord.Message | Discord.BaseInteraction} object
	 * @param {boolean} reply
	 */
	public async onError(object: Discord.Message | Discord.BaseInteraction, reply: boolean = true)
	{
		if (reply && (object instanceof Discord.Message
		              || object instanceof Discord.CommandInteraction))
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
