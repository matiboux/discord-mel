import Hook from './Hook'

class HookManager
{
	private _hooks: { [key: string]: Hook } = {}

	public get(name: string): Hook
	{
		if (typeof this._hooks[name] === 'undefined')
		{
			this._hooks[name] = new Hook(name)
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

export default HookManager
