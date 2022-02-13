function serialize(target: any): any
{
	if (typeof target === 'object' && typeof target.serialize === 'function')
	{
		return target.serialize()
	}

	return target
}

export default serialize
