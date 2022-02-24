import Discord from 'discord.js'

import AbstractHandler from './AbstractHandler'
import MessageReactionHandlerEvents from './MessageReactionHandlerEvents'
import MessageReactionHandlerOptions from './MessageReactionHandlerOptions'

type FilterFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean

type AsyncFilterFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => Promise<boolean>

type StoreFilterFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean

class MessageReactionHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public asyncfilter?: AsyncFilterFunction

	public storefilter?: StoreFilterFunction

	public readonly options: MessageReactionHandlerOptions = new MessageReactionHandlerOptions()

	public readonly on: MessageReactionHandlerEvents = new MessageReactionHandlerEvents()

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
