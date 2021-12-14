import IContext from './IContext'

abstract class AbstractContext implements IContext
{
	/**
	 * Whether or not the bot is enabled in this context.
	 */
	public enabled: boolean = true

	/**
	 * Whether or not the bot should ignore commands from other bots.
	 */
	 public ignoreBots: boolean = true

	/**
	 * Whether or not the bot should respond to message commands.
	 */
	public messageCommands: boolean = false

	/**
	 * The prefix for message commands.
	 */
	public prefix: string = '!'

	/**
	 * Whether or not the bot should respond to mentions commands.
	 */
	public mentionCommands: boolean = false

	public constructor(config?: AbstractContext)
	{
		if (config)
		{
			this.mergeWith(config)
		}
	}

	public mergeWith(config: AbstractContext): this
	{
		this.enabled = config.enabled
		this.ignoreBots = config.ignoreBots
		this.messageCommands = config.messageCommands
		this.prefix = config.prefix
		this.mentionCommands = config.mentionCommands

		return this
	}
}

export default AbstractContext
