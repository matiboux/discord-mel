import Mergeable from '../../functions/Mergeable'
import ServiceConfigType from './ServiceConfigType'

class ServicesConfigType extends Map<string, ServiceConfigType> implements Mergeable
{
	public mergeWith(object: any): this
	{
		for (const key in object)
		{
			const guild = new ServiceConfigType(object[key])
			this.set(key, guild)
		}

		return this
	}
}

export default ServicesConfigType
