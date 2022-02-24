import Discord from 'discord.js'

import AbstractHandler from './AbstractHandler'
import MessageHandlerEvents from './MessageHandlerEvents'

class MessageHandler extends AbstractHandler
{
	public filter?: (message: Discord.Message) => boolean

	public asyncfilter?: (message: Discord.Message) => Promise<boolean>

	public readonly on: MessageHandlerEvents = new MessageHandlerEvents()

	public setFilter(filterFunction?: (message: Discord.Message) => boolean): this
	{
		this.filter = filterFunction
		return this
	}

	public setAsyncFilter(asyncfilterFunction?: (message: Discord.Message) => Promise<boolean>): this
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
