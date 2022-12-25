import Discord from 'discord.js'
import Mel from '../Mel.js'

import AbstractListener from './AbstractListener.js'
import ChannelMessageHandler from './handler/ChannelMessageHandler.js'
import ListenerTypes from './ListenerTypes.js'

class ChannelMessageListener extends AbstractListener
{
    public readonly handler: ChannelMessageHandler

    public readonly channel: Discord.TextBasedChannel

    public readonly collector: Discord.MessageCollector

	public constructor(id: string, bot: Mel, handler: ChannelMessageHandler, channel: Discord.TextBasedChannel)
	{
		super(id, bot, ListenerTypes.MESSAGE)

		this.handler = handler
		this.channel = channel

		const dbListener = this.getDbListener()
		if (!dbListener)
		{
			throw new Error('DB listener not found')
		}

		const filter = (message: Discord.Message) =>
			handler.filter ? handler.filter(this, message) : true

		const options = handler.options
		if (dbListener.timeout !== undefined && dbListener.timeout >= 0)
		{
			options.time = dbListener.timeout - Date.now()
		}
		if (dbListener.idleTimeout !== undefined && dbListener.idleTimeout >= 0)
		{
			options.idle = dbListener.idleTimeout
		}

		this.collector = channel.createMessageCollector({ filter, ...options })

		// Attach the handler to the collector
		this.collector
			.on('collect', this.onCollect.bind(this))
			.on('dispose', this.onDispose.bind(this))
			.on('end', this.onEnd.bind(this))
	}

	public static async create(listenerId: string, bot: Mel, handler: ChannelMessageHandler): Promise<ChannelMessageListener>
	{
		const dbListener = bot.state.db.listeners.get(listenerId)
		if (!dbListener)
		{
			return Promise.reject(new Error('Cannot register ChannelMessageListener: DB listener not found'))
		}

		if (!dbListener.targetId)
		{
			return Promise.reject(new Error('Cannot register ChannelMessageListener: Target channel not specified'))
		}

		const channel = await bot.client.channels.fetch(dbListener.targetId).catch(() => undefined)
		if (!channel)
		{
			return Promise.reject(new Error('Cannot register ChannelMessageListener: Unknown target channel'))
		}
		if (!channel.isText())
		{
			return Promise.reject(new Error('Cannot register ChannelMessageListener: Target channel is not a text channel'))
		}

		return new this(listenerId, bot, handler, channel)
	}

	protected async onCollect(message: Discord.Message): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, message)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener || dbListener.collected.includes(message.id))
			{
				return // Invalid or Already collected
			}

			// Collect and save state
			dbListener.collected.push(message.id)
			this.bot.state.save()
		}

		this.bot.logger.debug(`Message ${message.id} by ${message.author.username} collected in channel ${this.channel.id} (id: ${this.id})`, 'ChannelMessageListener')

		try
		{
			this.handler.on.collect?.(this, message)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.collect', 'ChannelMessageListener', error)
		}
	}

	protected async onDispose(message: Discord.Message): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, message)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener)
			{
				return // Invalid
			}

			const i = dbListener.collected.indexOf(message.id)
			if (i < 0)
			{
				return // Not collected
			}

			dbListener.collected.splice(i, 1) // Remove
			this.bot.state.save()
		}

		this.bot.logger.debug(`Message ${message.id} by ${message.author.username} disposed on message ${this.channel.id} (id: ${this.id})`, 'ChannelMessageListener')

		try
		{
			this.handler.on.dispose?.(this, message)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.dispose', 'ChannelMessageListener', error)
		}
	}

	protected async onEnd(collected: Discord.Collection<string, Discord.Message>, reason: string): Promise<void>
	{
		this.bot.logger.debug(`Message collection ended (reason: ${reason}) (id: ${this.id})`, 'ChannelMessageListener')

		try
		{
			this.handler.on.end?.(this, collected, reason)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.end', 'ChannelMessageListener', error)
		}

		// Delete listener
		this.bot.listeners.delete(this.id)
	}

	public end(reason: string = 'user'): void
	{
		this.collector.stop(reason)
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
			this.bot.logger.warn('An error occured in handler.on.delete', 'ChannelMessageListener', error)
		}

		this.collector.stop('delete')
	}
}

export default ChannelMessageListener
