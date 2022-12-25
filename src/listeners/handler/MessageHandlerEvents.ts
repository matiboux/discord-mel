import Discord from 'discord.js'

import MessageListener from '../MessageListener.js'
import AbstractHandlerEvents from './AbstractHandlerEvents.js'

type CollectFunction = (listener: MessageListener, message: Discord.Message) => void

type EndFunction = (listener: MessageListener, reason: string) => void

type DeleteFunction = (listener: MessageListener) => void

class MessageHandlerEvents extends AbstractHandlerEvents
{
	public collect?: CollectFunction

	public end?: EndFunction

	public delete?: DeleteFunction

	public setCollect(collectFunction?: CollectFunction): this
	{
		this.collect = collectFunction
		return this
	}

	public setEnd(endFunction?: EndFunction): this
	{
		this.end = endFunction
		return this
	}

	public setDelete(deleteFunction: DeleteFunction): this
	{
		this.delete = deleteFunction
		return this
	}
}

export default MessageHandlerEvents
