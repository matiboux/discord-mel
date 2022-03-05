import Mel from '../Mel'
import Service from './AbstractService'

class ServicesManager
{
	protected services: Map<string, Service> = new Map<string, Service>()

	public readonly bot: Mel

	public constructor(bot: Mel)
	{
		this.bot = bot
	}

	public get(service: Service | string): Service | undefined
	{
		if (typeof service === 'string')
		{
			return this.services.get(service)
		}

		return this.services.get(service.name)
	}

	public add(service: Service): this
	{
		this.services.set(service.name, service)
		return this
	}

	public remove(service: Service | string): this
	{
		const serviceName = typeof service === 'string' ? service : service.name
		const serviceObject = this.services.get(serviceName)
		if (serviceObject !== undefined)
		{
			// Disable and remove the service
			serviceObject.disable()
			this.services.delete(serviceName)
		}

		return this
	}

	public enable(service: Service | string): Service | undefined
	{
		return this.get(service)?.enable()
	}

	public disable(service: Service | string): Service | undefined
	{
		return this.get(service)?.disable()
	}
}

export default ServicesManager
