interface ServiceInterface
{
	/**
	 * Return whether the service is enabled
	 */
	isEnabled(): boolean

	/**
	 * Enable the service
	 */
	enable(): this

	/**
	 * Disable the service
	 */
	disable(): this
}

export default ServiceInterface
