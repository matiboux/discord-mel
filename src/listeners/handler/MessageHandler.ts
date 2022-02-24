import Discord from 'discord.js'

import AbstractHandler from './AbstractHandler'
import MessageHandlerEvents from './MessageHandlerEvents'

type FilterFunction = (listenerId: string, message: Discord.Message) => boolean

type AsyncFilterFunction = (listenerId: string, message: Discord.Message) => Promise<boolean>

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
