import IUnserialize from '../../functions/IUnserialize.js'
import ServiceConfigType from './ServiceConfigType.js'

class ServicesConfigType extends Map<string, ServiceConfigType> implements IUnserialize
{
	public unserialize(object: any): this
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
