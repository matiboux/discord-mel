import Discord from 'discord.js'

import AbstractHandlerEvents from './AbstractHandlerEvents'

type CollectFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type RemoveFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type DisposeFunction = (listenerId: string, message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

type EndFunction = (listenerId: string, message: Discord.Message, collected: any[], reason: string) => void

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
