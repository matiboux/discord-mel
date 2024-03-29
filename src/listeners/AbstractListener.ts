import Mel from '../Mel.js'
import DBListener from '../state/db/types/DBListener.js'
import AbstractHandler from './handler/AbstractHandler.js'
import ListenerTypes from './ListenerTypes.js'

abstract class AbstractListener
{
	public readonly id: string

	public readonly bot: Mel

	public readonly type: ListenerTypes

	public readonly handler!: AbstractHandler // Need to be initialized in the child class

	public constructor(id: string, bot: Mel, type: ListenerTypes)
	{
		this.id = id
		this.bot = bot
		this.type = type
	}

	public getDbListener(): DBListener | undefined
	{
		return this.bot.state.db.listeners.get(this.id)
	}

	public end(reason: string = 'user'): void
	{
		// Delete listener
		this.bot.logger.debug(`Message listener ended (reason: ${reason}) (id: ${this.id})`, 'MessageListener')
		this.bot.listeners.delete(this.id)
	}

	public abstract onDelete(): void
}

export default AbstractListener
