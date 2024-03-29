import Discord from 'discord.js'

import MessageReactionListener from '../MessageReactionListener.js'
import AbstractHandlerEvents from './AbstractHandlerEvents.js'

type CollectFunction = (listener: MessageReactionListener, reaction: Discord.MessageReaction, user: Discord.User) => void

type RemoveFunction = (listener: MessageReactionListener, reaction: Discord.MessageReaction, user: Discord.User) => void

type DisposeFunction = (listener: MessageReactionListener, reaction: Discord.MessageReaction, user: Discord.User) => void

type EndFunction = (listener: MessageReactionListener, collected: any[], reason: string) => void

type DeleteFunction = (listener: MessageReactionListener) => void

class MessageReactionHandlerEvents extends AbstractHandlerEvents
{
	public collect?: CollectFunction

	public remove?: RemoveFunction

	public dispose?: DisposeFunction

	public end?: EndFunction

	public delete?: DeleteFunction

	public setCollect(collectFunction?: CollectFunction): this
	{
		this.collect = collectFunction
		return this
	}

	public setRemove(removeFunction?: RemoveFunction): this
	{
		this.remove = removeFunction
		return this
	}

	public setDispose(disposeFunction?: DisposeFunction): this
	{
		this.dispose = disposeFunction
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

export default MessageReactionHandlerEvents
