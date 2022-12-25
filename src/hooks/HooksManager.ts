import Mel from '../Mel.js'
import Hook from './Hook.js'

class HooksManager
{
	protected hooks: Map<string, Hook> = new Map<string, Hook>()

	public readonly bot: Mel

	public constructor(bot: Mel)
	{
		this.bot = bot
	}

	public get(name: string): Hook
	{
		const hook = this.hooks.get(name)
		if (hook !== undefined) return hook

		const newHook = new Hook(name, this.bot)
		this.hooks.set(name, newHook)
		return newHook
	}

	public add(name: string, callback: Function, priority: number = 10): Hook
	{
		return this.get(name).add(callback, priority)
	}

	public remove(name: string, callback: Function, priority: number = 10): void
	{
		this.hooks.get(name)?.remove(callback, priority)
	}

	public execute(name: string, ...args: any[]): void
	{
		this.get(name).execute(...args)
	}
}

export default HooksManager
