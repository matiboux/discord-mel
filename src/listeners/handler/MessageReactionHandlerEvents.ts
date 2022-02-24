import Discord from 'discord.js'

import AbstractListener from '../AbstractListener'
import AbstractHandlerEvents from './AbstractHandlerEvents'

type CollectFunction = (listener: AbstractListener, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type RemoveFunction = (listener: AbstractListener, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type DisposeFunction = (listener: AbstractListener, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type EndFunction = (listener: AbstractListener, message: Discord.Message, collected: any[], reason: string) => void

class MessageReactionHandlerEvents extends AbstractHandlerEvents
{
	public collect?: CollectFunction

	public remove?: RemoveFunction

	public dispose?: DisposeFunction

	public end?: EndFunction

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
}

export default MessageReactionHandlerEvents
