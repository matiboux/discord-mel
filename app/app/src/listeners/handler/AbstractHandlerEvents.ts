abstract class AbstractHandlerEvents
{
	public delete?: Function

	public setDelete(deleteFunction: Function): this
	{
		this.delete = deleteFunction
		return this
	}
}

export default AbstractHandlerEvents
