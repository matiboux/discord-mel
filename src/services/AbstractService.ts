import Mel from '../Mel'
import Logger from '../logger/Logger'
import Translator from '../Translator'

abstract class AbstractService
{
	public readonly name: string

	private enabled: boolean = false

	protected bot?: Mel
	protected logger: Logger
	protected translator: Translator

	constructor(name: string, bot?: Mel)
	{
		this.name = name;

		this.bot = bot
		this.logger = this.bot?.logger || new Logger()
		this.translator = this.bot?.translator || new Translator()
	}

	/**
	 * Return whether the service is enabled
	 */
	public isEnabled(): boolean
	{
		return this.enabled
	}

	/**
	 * Enable the service
	 */
	public enable(): this
	{
		this.enabled = true
		// Override this method to do something when the service is enabled
		return this
	}

	/**
	 * Disable the service
	 */
	public disable(): this
	{
		this.enabled = false
		// Override this method to do something when the service is disabled
		return this
	}
}

export default AbstractService
