import Discord from 'discord.js'

import MessageComponentListener from '../MessageComponentListener.js'
import AbstractHandler from './AbstractHandler.js'
import MessageComponentHandlerEvents from './MessageComponentHandlerEvents.js'
import MessageComponentHandlerOptions from './MessageComponentHandlerOptions.js'

type FilterFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => boolean | Promise<boolean>

type StoreFilterFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => boolean

class MessageComponentHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public storefilter?: StoreFilterFunction

	public readonly options: MessageComponentHandlerOptions = new MessageComponentHandlerOptions()

	public readonly on: MessageComponentHandlerEvents = new MessageComponentHandlerEvents()

	public setFilter(filterFunction?: FilterFunction): this
	{
		this.filter = filterFunction
		return this
	}

	public setStoreFilter(storefilterFunction?: StoreFilterFunction): this
	{
		this.storefilter = storefilterFunction
		return this
	}

	public configureOptions(optionsFunction: (options: MessageComponentHandlerOptions) => void): this
	{
		optionsFunction(this.options)
		return this
	}

	public configureOn(onFunction: (on: MessageComponentHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default MessageComponentHandler
