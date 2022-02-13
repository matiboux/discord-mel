function serialize(target: any): any
{
	if (typeof target === 'object')
	{
		if (typeof target.serialize === 'function')
		{
			return target.serialize()
		}

		if (Array.isArray(target))
		{
			return target.map(serialize)
		}

		target = Object.assign({}, target) // Shallow copy
		for (const key in target)
		{
			target[key] = serialize(target[key])
		}
	}

	return target
}

export default serialize
