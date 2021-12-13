import Mel from '../Mel'
import Logger from '../logger/Logger'
import Translator from '../Translator'

class Hook
{
	public readonly name: string

	private callbacks: Function[][] = []

	private bot?: Mel
	private logger: Logger
	private translator: Translator

	constructor(name: string, bot?: Mel)
	{
		this.name = name;

		this.bot = bot
		this.logger = this.bot?.logger || new Logger()
		this.translator = this.bot?.translator || new Translator()
	}

    public add(callback: Function, priority: number = 10): Hook
	{
		if (!Array.isArray(this.callbacks[priority]))
		{
			this.callbacks[priority] = []
		}

        this.callbacks[priority].push(callback)
		return this
    }

    public remove(callback: Function, priority: number = 10): void
	{
		if (!Array.isArray(this.callbacks[priority]))
		{
			return
		}

		this.callbacks[priority] = this.callbacks[priority].filter(cb => cb !== callback)
    }

	public execute(...args: any[]): void
	{
		if (this.callbacks.length > 0)
		{
			this.callbacks.forEach(callbacks =>
				callbacks.forEach(callback =>
					callback.apply(null, args)))
		}
		else
		{
			this.logger.debug(this.translator.translate('hooks.empty', {
					'%name%': this.name,
				}), 'Hook')
		}
    }

	public get callback(): (...args: any[]) => void
	{
		return this.execute.bind(this)
    }
}

export default Hook
