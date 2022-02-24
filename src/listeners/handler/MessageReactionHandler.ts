import Discord from 'discord.js'

import AbstractHandler from './AbstractHandler'
import MessageReactionHandlerEvents from './MessageReactionHandlerEvents'
import MessageReactionHandlerOptions from './MessageReactionHandlerOptions'

class MessageReactionHandler extends AbstractHandler
{
	public filter?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean

	public asyncfilter?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => Promise<boolean>

	public storefilter?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean

	public readonly options: MessageReactionHandlerOptions = new MessageReactionHandlerOptions()

	public readonly on: MessageReactionHandlerEvents = new MessageReactionHandlerEvents()

	public setFilter(filterFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean): this
	{
		this.filter = filterFunction
		return this
	}

	public setAsyncFilter(asyncfilterFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => Promise<boolean>): this
	{
		this.asyncfilter = asyncfilterFunction
		return this
	}

	public setStoreFilter(storefilterFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => boolean): this
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
