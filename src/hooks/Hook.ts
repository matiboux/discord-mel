class Hook
{
	public readonly name: string;

	private _callbacks: Function[][] = [];

	public constructor(name: string, callback?: Function)
	{
		this.name = name;
	}

    public add(callback: Function, priority: number = 10): void
	{
		if (!Array.isArray(this._callbacks[priority]))
		{
			this._callbacks[priority] = []
		}

        this._callbacks[priority].push(callback)
    }

    public remove(callback: Function, priority: number = 10): void
	{
		if (!Array.isArray(this._callbacks[priority]))
		{
			return
		}

		this._callbacks[priority] = this._callbacks[priority].filter(cb => cb !== callback)
    }

	public execute(...args: any[]): void
	{
		this._callbacks.forEach(callbacks =>
			callbacks.forEach(callback =>
				callback.apply(null, args)))
    }
}

export default Hook
