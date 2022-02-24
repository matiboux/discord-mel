abstract class AbstractHandlerEvents
{
	public delete?: () => void

	public setDelete(deleteFunction: () => void): this
	{
		this.delete = deleteFunction
		return this
	}
}

export default AbstractHandlerEvents
