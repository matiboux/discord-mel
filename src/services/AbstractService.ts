import Mel from '../Mel.js'
import Logger from '../logger/Logger.js'
import Translator from '../Translator.js'
import ServiceInterface from './ServiceInterface.js'
import ServiceConfigType from '../config/types/ServiceConfigType.js'

abstract class AbstractService implements ServiceInterface
{
	public readonly name: string

	private enabled: boolean = false

	protected bot?: Mel
	protected logger: Logger
	protected translator: Translator

	public constructor(name: string, config?: ServiceConfigType, bot?: Mel)
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
		}), 'Services')

		// Override this method to do something when the service is enabled
		return this
	}

	public disable(): this
	{
		this.enabled = false

		this.logger.info(this.translator.translate('services.disabled', {
			'%name%': this.name,
		}), 'Services')

		// Override this method to do something when the service is disabled
		return this
	}
}

export default AbstractService
