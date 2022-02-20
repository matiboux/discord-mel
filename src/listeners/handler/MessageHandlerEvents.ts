import Discord from 'discord.js'

import AbstractHandlerEvents from './AbstractHandlerEvents'

class MessageHandlerEvents extends AbstractHandlerEvents
{
	public collect?: (message: Discord.Message) => void

	public end?: (reason: string) => void

	public setCollect(collectFunction?: (message: Discord.Message) => void): this
	{
		this.collect = collectFunction
		return this
	}

	public setEnd(endFunction?: (reason: string) => void): this
	{
		this.end = endFunction
		return this
	}
}

export default MessageHandlerEvents
