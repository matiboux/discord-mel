import Discord from 'discord.js'

import MessageReactionListener from '../MessageReactionListener.js'
import AbstractHandler from './AbstractHandler.js'
import MessageReactionHandlerEvents from './MessageReactionHandlerEvents.js'
import MessageReactionHandlerOptions from './MessageReactionHandlerOptions.js'

type FilterFunction = (listener: MessageReactionListener, reaction: Discord.MessageReaction, user: Discord.User) => boolean | Promise<boolean>

type StoreFilterFunction = (listener: MessageReactionListener, reaction: Discord.MessageReaction, user: Discord.User) => boolean

class MessageReactionHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public storefilter?: StoreFilterFunction

	public readonly options: MessageReactionHandlerOptions = new MessageReactionHandlerOptions()

	public readonly on: MessageReactionHandlerEvents = new MessageReactionHandlerEvents()

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

	public configureOptions(optionsFunction: (options: MessageReactionHandlerOptions) => void): this
	{
		optionsFunction(this.options)
		return this
	}

	public configureOn(onFunction: (on: MessageReactionHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default MessageReactionHandler
