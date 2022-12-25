import unserialize from '../../../functions/unserialize.js'

abstract class AbstractDBType
{
	public constructor(object?: AbstractDBType)
	{
		// Initialize properties
		this.initProperties()

		if (object)
		{
			unserialize(this, object)
		}
	}

	/**
	 * Method to initialize the properties before the parent constructor is called
	 */
	protected abstract initProperties(): void
}

export default AbstractDBType
