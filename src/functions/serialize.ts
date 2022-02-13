function serialize(target: any): any
{
	if (typeof target === 'object')
	{
		if (typeof target.serialize === 'function')
		{
			return target.serialize()
		}

		return Object.fromEntries(target)
	}

	return target
}

export default serialize
