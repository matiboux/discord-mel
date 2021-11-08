import Discord from 'discord.js'
import Collection = Discord.Collection
import Bot from '../Bot'
import AbstractCommand from './AbstractCommand'
import Translator from '../Translator';

/**
 * @extends {Collection<string, AbstractCommand>}
 */
class CommandsCollection extends Collection<string, AbstractCommand>
{
	/**
	 * @type {Bot|undefined}
	 */
	#bot: Bot | undefined = undefined

	constructor(bot: Bot | undefined = undefined)
	{
		super()

		if (bot) this.#setBot(bot)
	}

	/**
	 * @param {Bot|undefined} bot
	 */
	#setBot(bot: Bot | undefined): void
	{
		this.#bot = bot
	}

	get translator(): Translator | undefined
	{
		return this.#bot?.translator
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
	async onMessage(commandName: string, message: Discord.Message, args: string)
	{
		const command = this.get(commandName)
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
					console.error(error)
				}
			}
		}
		else
		{
			console.error(this.translator?.translate('commands.run.not_found', {
					'%name%': commandName
				}))
		}

		return commandExecuted
	}

	/**
	 * @param {string} commandName
	 * @param {Discord.Interaction} interaction
	 */
	async onInteraction(commandName: string, interaction: Discord.Interaction)
	{
		const command = this.get(commandName)
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
					await command.onInteraction(interaction)
					commandExecuted = true
				}
				catch (error)
				{
					command.onError(interaction)
					console.error(error)
				}
			}
		}
		else
		{
			console.error(this.translator?.translate('commands.run.not_found', {
					'%name%': commandName
				}))
		}

		return commandExecuted
	}
}

export default CommandsCollection
