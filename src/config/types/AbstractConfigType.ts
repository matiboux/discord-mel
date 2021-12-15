import assignDeep from '../../functions/assignDeep'

abstract class AbstractConfigType
{
	public constructor(type?: AbstractConfigType)
	{
		if (type)
		{
			assignDeep(this, type)
		}
	}
}

export default AbstractConfigType
