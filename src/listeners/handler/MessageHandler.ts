import Discord from 'discord.js'

import MessageListener from '../MessageListener'
import AbstractHandler from './AbstractHandler'
import MessageHandlerEvents from './MessageHandlerEvents'

type FilterFunction = (listener: MessageListener, message: Discord.Message) => boolean

type AsyncFilterFunction = (listener: MessageListener, message: Discord.Message) => Promise<boolean>

class MessageHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public asyncfilter?: AsyncFilterFunction

	public readonly on: MessageHandlerEvents = new MessageHandlerEvents()

	public setFilter(filterFunction?: FilterFunction): this
	{
		this.filter = filterFunction
		return this
	}

	public setAsyncFilter(asyncfilterFunction?: AsyncFilterFunction): this
	{
		this.asyncfilter = asyncfilterFunction
		return this
	}

	public configureOn(onFunction: (on: MessageHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default MessageHandler
