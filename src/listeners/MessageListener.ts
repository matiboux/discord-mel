import Discord from 'discord.js'
import Mel from '../Mel'

import AbstractListener from './AbstractListener'
import MessageHandler from './handler/MessageHandler'
import ListenerTypes from './ListenerTypes'

class MessageListener extends AbstractListener
{
    public readonly bot: Mel

    public readonly handler: MessageHandler

    public readonly user: Discord.User

	public constructor(listenerId: string, bot: Mel, handler: MessageHandler, user: Discord.User)
	{
		super(listenerId, ListenerTypes.MESSAGE)

		this.bot = bot
		this.handler = handler
		this.user = user

		this.bot.hooks.add('messageCreate', this.onMessageCreate.bind(this))
	}

	protected async onMessageCreate(message: Discord.Message): Promise<void>
	{
		const dbListener = this.bot.state.db.listeners.get(this.listenerId)
		if (!dbListener || dbListener.targetId !== message.author.id)
		{
			return // Not listening on this channel
		}

		this.collect(message)
	}

	public async collect(message: Discord.Message)
	{
		const dbListener = this.bot.state.db.listeners.get(this.listenerId)
		if (!dbListener)
		{
			return
		}

		if (dbListener.timeout && dbListener.timeout < new Date().getTime())
		{
			this.end('time')
			return
		}
		if (dbListener.idleTimeout && dbListener.lastCallTime + dbListener.idleTimeout < Date.now())
		{
			this.end('idle')
			return
		}

		if ((this.handler.filter && !this.handler.filter(message))
			|| (this.handler.asyncfilter && !await this.handler.asyncfilter(message)))
		{
			return
		}

		dbListener.lastCallTime = Date.now()

		this.bot.logger.debug(`Message ${message.id} by ${message.author.username} collected in channel ${message.channel.id}`, 'MessageListener')
		this.handler.on.collect?.(message)
	}

	public end(reason: string)
	{
		this.handler.on.end?.(reason)

		// Delete listener
		this.bot.logger.debug(`Message listener ended (id: ${this.listenerId})`, 'MessageListener')
		this.bot.listeners.delete(this.listenerId)
	}

	public delete()
	{
		this.handler.on.delete?.()
	}
}

export default MessageListener
