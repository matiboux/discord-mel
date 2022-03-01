import Discord from 'discord.js'

import MessageComponentListener from '../MessageComponentListener'
import AbstractHandlerEvents from './AbstractHandlerEvents'

type CollectFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => void

type DisposeFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => void

type EndFunction = (listener: MessageComponentListener, collected: any[], reason: string) => void

type DeleteFunction = (listener: MessageComponentListener) => void

class MessageComponentHandlerEvents extends AbstractHandlerEvents
{
	public collect?: CollectFunction

	public dispose?: DisposeFunction

	public end?: EndFunction

	public delete?: DeleteFunction

	public setCollect(collectFunction?: CollectFunction): this
	{
		this.collect = collectFunction
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

export default MessageComponentHandlerEvents
