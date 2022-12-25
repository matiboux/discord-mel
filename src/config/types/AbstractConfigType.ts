import unserialize from '../../functions/unserialize.js'

abstract class AbstractConfigType
{
	public constructor(type?: AbstractConfigType)
	{
		if (type)
		{
			unserialize(this, type)
		}
	}
}

export default AbstractConfigType
