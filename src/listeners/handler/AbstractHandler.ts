import AbstractListener from '../AbstractListener'
import AbstractHandlerEvents from './AbstractHandlerEvents'

type BaseFilterFunction = (listener: AbstractListener, ...args: any[]) => boolean

abstract class AbstractHandler
{
	public filter?: BaseFilterFunction

	public readonly on!: AbstractHandlerEvents // Must be initialized in the child class

	public setFilter(filterFunction?: BaseFilterFunction): this
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
