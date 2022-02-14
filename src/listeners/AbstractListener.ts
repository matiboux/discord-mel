import AbstractHandler from './handler/AbstractHandler'
import ListenerTypes from './ListenerTypes'

abstract class AbstractListener
{
	public readonly type: ListenerTypes

    public readonly handler!: AbstractHandler // Need to be initialized in the child class

	public constructor(type: ListenerTypes)
	{
		this.type = type
	}

	public abstract delete(): void
}

export default AbstractListener
