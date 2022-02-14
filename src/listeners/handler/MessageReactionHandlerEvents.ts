import Discord from 'discord.js'

import AbstractHandlerEvents from './AbstractHandlerEvents'

class MessageReactionHandlerEvents extends AbstractHandlerEvents
{
	public collect?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

	public remove?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

	public dispose?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void

	public end?: (message: Discord.Message, collected: any[], reason: string) => void

	public setCollect(collectFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void): this
	{
		this.collect = collectFunction
		return this
	}

	public setRemove(removeFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void): this
	{
		this.remove = removeFunction
		return this
	}

	public setDispose(disposeFunction?: (message: Discord.Message, reaction: Discord.MessageReaction, user: Discord.User) => void): this
	{
		this.dispose = disposeFunction
		return this
	}

	public setEnd(endFunction?: (message: Discord.Message, collected: any, reason: string) => void): this
	{
		this.end = endFunction
		return this
	}
}

export default MessageReactionHandlerEvents
