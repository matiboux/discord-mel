function assignDeep(target: any, ...sources: any[]): any
{
	if (sources.length <= 0)
		return target

	target = Object(target)
	const source = sources.shift()

	if (typeof target.mergeWith === 'function')
	{
		target.mergeWith(source)
	}
	else if (typeof source === 'object')
	{
		for (const key in source)
		{
			if (typeof source[key] === 'object')
			{
				target[key] = target[key] !== undefined ? Object(target[key]) : {}
				assignDeep(target[key], source[key])
			}
			else
			{
				Object.assign(target, { [key]: source[key] })
			}
		}
	}

	return assignDeep(target, ...sources)
}

export default assignDeep
