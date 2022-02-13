import unserialize from '../../../functions/unserialize'

abstract class AbstractStateType
{
	public constructor(type?: AbstractStateType)
	{
		if (type)
		{
			unserialize(this, type)
		}
	}
}

export default AbstractStateType
