import unserialize from '../../../functions/unserialize'

abstract class AbstractDBType
{
	public constructor(type?: AbstractDBType)
	{
		if (type)
		{
			unserialize(this, type)
		}
	}
}

export default AbstractDBType
