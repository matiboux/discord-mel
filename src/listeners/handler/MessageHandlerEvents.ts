import Discord from 'discord.js'

import AbstractListener from '../AbstractListener'
import AbstractHandlerEvents from './AbstractHandlerEvents'

type CollectFunction = (listener: AbstractListener, message: Discord.Message) => void

type EndFunction = (listener: AbstractListener, reason: string) => void

class MessageHandlerEvents extends AbstractHandlerEvents
{
	public collect?: CollectFunction

	public end?: EndFunction

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
}

export default MessageHandlerEvents
