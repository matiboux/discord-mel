import Mel from '../Mel'
import Hook from './Hook'

class HooksManager
{
	private _hooks: { [key: string]: Hook } = {}

	private bot?: Mel

	constructor(bot?: Mel)
	{
		this.bot = bot
	}

	public get(name: string): Hook
	{
		if (typeof this._hooks[name] === 'undefined')
		{
			this._hooks[name] = new Hook(name, this.bot)
		}

		return this._hooks[name]
	}

	public add(name: string, callback: Function, priority: number = 10): Hook
	{
		return this.get(name).add(callback, priority)
	}

	public remove(name: string, callback: Function, priority: number = 10): void
	{
		this._hooks[name]?.remove(callback, priority)
	}

	public execute(name: string, ...args: any[]): void
	{
		this._hooks[name]?.execute(...args)
	}
}

export default HooksManager
