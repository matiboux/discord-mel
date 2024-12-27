import Discord from 'discord.js'
import Mel from '../Mel.js'

import AbstractListener from './AbstractListener.js'
import MessageHandler from './handler/MessageHandler.js'
import ListenerTypes from './ListenerTypes.js'
import ListenerTargetTypes from './register/ListenerTargetTypes.js'

class MessageListener extends AbstractListener
{
    public readonly handler: MessageHandler

    // public readonly user: Discord.Channel | Discord.User

	public constructor(listenerId: string, bot: Mel, handler: MessageHandler) // , user: Discord.User)
	{
		super(listenerId, bot, ListenerTypes.MESSAGE)

		this.handler = handler
		// this.user = user

		this.bot.hooks.add('messageCreate', this.onMessageCreate.bind(this))
	}

	public static async create(listenerId: string, bot: Mel, handler: MessageHandler): Promise<MessageListener>
	{
		const dbListener = bot.state.db.listeners.get(listenerId)
		if (!dbListener)
		{
			throw new Error('DB listener not found')
		}

		if (!dbListener.targetId)
		{
			return Promise.reject(new Error('Cannot register MessageReactionListener: Target user or channel not specified'))
		}

		if (dbListener.targetType === ListenerTargetTypes.CHANNEL)
		{
			// Listen to messages from a channel
			const channel = await bot.client.channels.fetch(dbListener.targetId).catch(() => undefined)
			if (!channel)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: Unknown target channel'))
			}
		}
		else if (dbListener.targetType === ListenerTargetTypes.USER)
		{
			// Listen to messages from a user
			const user = await bot.client.users.fetch(dbListener.targetId).catch(() => undefined)
			if (!user)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: Unknown target user'))
			}
		}

		return new MessageListener(listenerId, bot, handler) // , user)
	}

	protected async onMessageCreate(message: Discord.Message): Promise<void>
	{
		const dbListener = this.bot.state.db.listeners.get(this.id)
		if (!dbListener)
		{
			return // Invalid listener
		}

		if (dbListener.targetType === ListenerTargetTypes.CHANNEL)
		{
			if (dbListener.targetId !== message.channel.id)
			{
				return // Not listening to this channel
			}
		}
		else if (dbListener.targetType === ListenerTargetTypes.USER)
		{
			if (dbListener.targetId !== message.author.id)
			{
				return // Not listening to this user
			}
		}
		else
		{
			return // Unsupported target type
		}

		this.collect(message)
	}

	public async collect(message: Discord.Message)
	{
		const dbListener = this.bot.state.db.listeners.get(this.id)
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

		if ((this.handler.filter && !this.handler.filter(this, message))
			|| (this.handler.asyncfilter && !await this.handler.asyncfilter(this, message)))
		{
			return
		}

		dbListener.lastCallTime = Date.now()

		this.bot.logger.debug(`Message ${message.id} by ${message.author.username} collected in channel ${message.channel.id} (id: ${this.id})`, 'MessageListener')

		try
		{
			this.handler.on.collect?.(this, message)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.collect', 'MessageListener', error)
		}
	}

	public end(reason: string = 'user'): void
	{
		try
		{
			this.handler.on.end?.(this, reason)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.end', 'MessageListener', error)
		}

		super.end(reason)
	}

	public onDelete(): void
	{
		try
		{
			this.handler.on.delete?.(this)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.delete', 'MessageListener', error)
		}
	}
}

export default MessageListener
