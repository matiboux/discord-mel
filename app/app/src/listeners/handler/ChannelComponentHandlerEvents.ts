import Discord from 'discord.js'

import ChannelComponentListener from '../ChannelComponentListener.js'
import AbstractHandlerEvents from './AbstractHandlerEvents.js'

type CollectFunction = (listener: ChannelComponentListener, interaction: Discord.MessageComponentInteraction) => void

type DisposeFunction = (listener: ChannelComponentListener, interaction: Discord.MessageComponentInteraction) => void

type EndFunction = (listener: ChannelComponentListener, collected: any[], reason: string) => void

type DeleteFunction = (listener: ChannelComponentListener) => void

class ChannelComponentHandlerEvents extends AbstractHandlerEvents
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

export default ChannelComponentHandlerEvents
