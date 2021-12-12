class Context
{
	/**
	 * Whether or not the bot is enabled in this context.
	 */
	public enabled: boolean = true

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
}

export default Context
