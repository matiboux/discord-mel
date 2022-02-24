import AbstractListener from '../AbstractListener'

type DeleteFunction = (listener: AbstractListener) => void

abstract class AbstractHandlerEvents
{
	public delete?: DeleteFunction

	public setDelete(deleteFunction: DeleteFunction): this
	{
		this.delete = deleteFunction
		return this
	}
}

export default AbstractHandlerEvents
