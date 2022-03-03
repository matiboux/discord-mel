import Discord from 'discord.js'

import ChannelMessageListener from '../ChannelMessageListener'
import AbstractHandlerEvents from './AbstractHandlerEvents'

type CollectFunction = (listener: ChannelMessageListener, message: Discord.Message) => void

type DisposeFunction = (listener: ChannelMessageListener, message: Discord.Message) => void

type EndFunction = (listener: ChannelMessageListener, collected: Discord.Collection<string, Discord.Message>, reason: string) => void

type DeleteFunction = (listener: ChannelMessageListener) => void

class MessageHandlerEvents extends AbstractHandlerEvents
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

export default MessageHandlerEvents
