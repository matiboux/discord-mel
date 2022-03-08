import unserialize from '../../../functions/unserialize'

abstract class AbstractDBType
{
	public constructor(type?: AbstractDBType)
	{
		// Initialize properties
		this.initProperties()

		if (type)
		{
			unserialize(this, type)
		}
	}

	/**
	 * Method to initialize the properties before the parent constructor is called
	 */
	protected abstract initProperties(): void
}

export default AbstractDBType
