function serialize(target: any): any
{
	if (typeof target === 'object')
	{
		if (typeof target.serialize === 'function')
		{
			return target.serialize()
		}

		if (typeof target[Symbol.iterator] === 'function')
		{
			const entries = Object.fromEntries(target)
			for (const key in entries)
			{
				entries[key] = serialize(entries[key])
			}

			return entries
		}
	}

	return target
}

export default serialize
