interface IContext
{
	/**
	 * Whether or not the bot is enabled in this context.
	 */
	enabled: boolean

	/**
	 * Whether or not the bot should ignore commands from other bots.
	 */
	ignoreBots: boolean

	/**
	 * Whether or not the bot should respond to message commands.
	 */
	messageCommands: boolean

	/**
	 * The prefix for message commands.
	 */
	prefix: string

	/**
	 * Whether or not the bot should respond to mentions commands.
	 */
	mentionCommands: boolean
}

export default IContext
