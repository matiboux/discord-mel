import Discord from 'discord.js'
import Collection = Discord.Collection

import Mel from '../Mel'
import AbstractCommand from './AbstractCommand'
import Translator from '../Translator'
import Logger from '../logger/Logger'

class CommandsCollection extends Collection<string, AbstractCommand>
{
	private bot?: Mel
	private logger: Logger
	private translator: Translator

	constructor(bot?: Mel)
	{
		super()

		this.bot = bot
		this.logger = this.bot?.logger || new Logger()
		this.translator = this.bot?.translator || new Translator()
	}

	/**
	 * Add command
	 *
	 * @param {AbstractCommand} command
	 * @returns {this}
	 */
	add(command: AbstractCommand): this
	{
		if (command.name === undefined)
			throw new Error('Invalid command object')

		return this.set(command.name, command)
	}

	/**
	 * @param {string} commandName
	 * @param {Discord.Message} message
	 * @param {string} args
	 */
	async onMessage(commandName: string, message: Discord.Message, args: string): Promise<void>
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
					this.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.logger.warn(this.translator.translate('commands.run.not_found', {
					'%name%': commandName
				}), this.constructor.name)
		}

		if (!commandExecuted)
			throw undefined
	}

	async onCommandInteraction(interaction: Discord.BaseCommandInteraction): Promise<void>
	{
		const command = this.get(interaction.commandName)
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
					this.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.logger.warn(this.translator.translate('commands.run.not_found', {
					'%name%': interaction.commandName
				}), this.constructor.name)
		}

		if (!commandExecuted)
			throw undefined
	}

	async onComponentInteraction(interaction: Discord.MessageComponentInteraction): Promise<void>
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
					this.logger.error(error, this.constructor.name)
				}
			}
		}
		else
		{
			this.logger.warn(this.translator.translate('commands.run.not_found', {
					'%name%': interaction.customId
				}), this.constructor.name)
		}

		if (!commandExecuted)
			throw undefined
	}

	async onAutocompleteInteraction(interaction: Discord.AutocompleteInteraction): Promise<void>
	{
		this.logger.error(this.translator.translate('interaction.not_supported', {
				'%type%': interaction.type
			}))

		throw undefined
	}
}

export default CommandsCollection
