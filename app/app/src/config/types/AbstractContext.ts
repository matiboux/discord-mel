import AbstractConfigType from './AbstractConfigType.js'
import IContext from './IContext.js'

abstract class AbstractContext extends AbstractConfigType implements IContext
{
	/**
	 * Whether or not the bot is enabled in this context.
	 */
	public enabled!: boolean

	/**
	 * Whether or not the bot should ignore commands from other bots.
	 */
	 public ignoreBots!: boolean

	/**
	 * Whether or not the bot should respond to message commands.
	 */
	public messageCommands!: boolean

	/**
	 * The prefix for message commands.
	 */
	public prefix!: string

	/**
	 * Whether or not the bot should respond to mentions commands.
	 */
	public mentionCommands!: boolean

	public constructor(type?: AbstractConfigType)
	{
		super(type)

		if (this.enabled as any === undefined)
		{
			this.enabled = true
		}

		if (this.ignoreBots as any === undefined)
		{
			this.ignoreBots = true
		}

		if (this.messageCommands as any === undefined)
		{
			this.messageCommands = true
		}

		if (this.prefix as any === undefined)
		{
			this.prefix = '!'
		}

		if (this.mentionCommands as any === undefined)
		{
			this.mentionCommands = false
		}
	}
}

export default AbstractContext
