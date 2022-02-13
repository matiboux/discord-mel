import IUnserialize from '../../functions/IUnserialize'
import ServiceConfigType from './ServiceConfigType'

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
