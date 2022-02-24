import Mel from '../Mel'
import AbstractHandler from './handler/AbstractHandler'
import ListenerTypes from './ListenerTypes'

abstract class AbstractListener
{
	public readonly listenerId: string

	public readonly bot: Mel

	public readonly type: ListenerTypes

	public readonly handler!: AbstractHandler // Need to be initialized in the child class

	public constructor(listenerId: string, bot: Mel, type: ListenerTypes)
	{
		this.listenerId = listenerId
		this.bot = bot
		this.type = type
	}

	public abstract delete(): void
}

export default AbstractListener
