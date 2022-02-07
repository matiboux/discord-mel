import assignDeep from '../../../functions/assignDeep'

abstract class AbstractStateType
{
	public constructor(type?: AbstractStateType)
	{
		if (type)
		{
			assignDeep(this, type)
		}
	}
}

export default AbstractStateType
