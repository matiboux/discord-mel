import AbstractHandlerEvents from './AbstractHandlerEvents.js'

abstract class AbstractHandler
{
	public filter?: Function

	public readonly on!: AbstractHandlerEvents // Must be initialized in the child class

	public setFilter(filterFunction?: Function): this
	{
		this.filter = filterFunction
		return this
	}

	public configureOn(onFunction: (on: AbstractHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default AbstractHandler
