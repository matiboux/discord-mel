import AbstractConfigType from './AbstractConfigType'

class ServiceConfigType extends AbstractConfigType
{
    [x: string]: any;

	/**
	 * Whether or not the service is to be enabled.
	 */
	public enabled: boolean = true
}

export default ServiceConfigType
