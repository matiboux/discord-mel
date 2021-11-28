class Hook
{
	public readonly name: string

	private callbacks: Function[][] = []

	public constructor(name: string)
	{
		this.name = name;
	}

    public add(callback: Function, priority: number = 10): void
	{
		if (!Array.isArray(this.callbacks[priority]))
		{
			this.callbacks[priority] = []
		}

        this.callbacks[priority].push(callback)
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
		console.log(this.callbacks)
		this.callbacks.forEach(callbacks =>
			callbacks.forEach(callback =>
				callback.apply(null, args)))
    }

	public get callback(): (...args: any[]) => void
	{
		return this.execute.bind(this)
    }
}

export default Hook
