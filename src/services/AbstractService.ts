import Mel from '../Mel'
import Logger from '../logger/Logger'
import Translator from '../Translator'
import ServiceInterface from './ServiceInterface'

abstract class AbstractService implements ServiceInterface
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

	public isEnabled(): boolean
	{
		return this.enabled
	}

	public enable(): this
	{
		this.enabled = true

		this.logger.info(this.translator.translate('services.enabled', {
			'%name%': this.name,
		}))

		// Override this method to do something when the service is enabled
		return this
	}

	public disable(): this
	{
		this.enabled = false

		this.logger.info(this.translator.translate('services.disabled', {
			'%name%': this.name,
		}))

		// Override this method to do something when the service is disabled
		return this
	}
}

export default AbstractService
