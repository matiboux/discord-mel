import Discord from 'discord.js'
import Collection = Discord.Collection

import Mel from '../Mel.js'
import AbstractCommand from './AbstractCommand.js'

class CommandsCollection extends Collection<string, AbstractCommand>
{
	public readonly bot: Mel

	public constructor(bot: Mel)
	{
		super()

		this.bot = bot
	}

	/**
	 * Add command
	 *
	 * @param {AbstractCommand} command
	 * @returns {this}
	 */
	public add(commandClass: typeof AbstractCommand): this
	{
		const commandId = commandClass.name
		return this.set(commandId, new commandClass(commandId, this.bot))
	}

	/**
	 * @param {string} commandName
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	public async onMessage(commandName: string, message: Discord.Message, args: string): Promise<void>
	{
		const command = this.find(cmd => cmd.commandAliases.has(commandName))
		let commandExecuted = false

		if (command)
		{
			if (!command.isEnabled(message))
			{
				command.onNotEnabled(message)
			}
			else if (!command.isAllowed(message))
			{
				command.onNotAllowed(message)
			}
			else
			{
				try
				{
					await command.onMessage(message, args)
					commandExecuted = true
				}
				catch (error)
				{
					command.onError(message)
					this.bot.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.not_found', {
					'%name%': commandName
				}), this.constructor.name)
		}

		if (!commandExecuted)
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.failed'),
				this.constructor.name,
				new Error('Failed to execute command'))
		}
	}

	public async onCommandInteraction(interaction: Discord.CommandInteraction): Promise<void>
	{
		const command = this.find(cmd => Array.from(cmd.applicationCommands.values()).some(app => app.name === interaction.commandName))
		let commandExecuted = false

		if (command)
		{
			if (!command.isEnabled(interaction))
			{
				command.onNotEnabled(interaction)
			}
			else if (!command.isAllowed(interaction))
			{
				command.onNotAllowed(interaction)
			}
			else
			{
				try
				{
					await command.onCommandInteraction(interaction)
					commandExecuted = true
				}
				catch (error)
				{
					command.onError(interaction)
					this.bot.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.not_found', {
					'%name%': interaction.commandName
				}), this.constructor.name)
		}

		if (!commandExecuted)
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.failed'),
				this.constructor.name,
				new Error('Failed to execute command'))
		}
	}

	public async onComponentInteraction(interaction: Discord.MessageComponentInteraction): Promise<void>
	{
		const command = this.find(cmd => cmd.componentIds.has(interaction.customId))
		let commandExecuted = false

		if (command)
		{
			if (!command.isEnabled(interaction))
			{
				command.onNotEnabled(interaction)
			}
			else if (!command.isAllowed(interaction))
			{
				command.onNotAllowed(interaction)
			}
			else
			{
				try
				{
					await command.onComponentInteraction(interaction)
					commandExecuted = true
				}
				catch (error)
				{
					command.onError(interaction)
					this.bot.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.not_found', {
					'%name%': interaction.customId
				}), this.constructor.name)
		}

		if (!commandExecuted)
		{
			this.bot.logger.warn(this.bot.translator.translate('commands.run.failed'),
				this.constructor.name,
				new Error('Failed to execute command'))
		}
	}

	public async onAutocompleteInteraction(interaction: Discord.AutocompleteInteraction): Promise<void>
	{
		this.bot.logger.error(this.bot.translator.translate('interaction.not_supported', {
				'%type%': interaction.type
			}), this.constructor.name, new Error('Autocomplete interaction not supported'))
	}
}

export default CommandsCollection
