import Discord from 'discord.js'
import Mel from '../Mel.js'

import AbstractListener from './AbstractListener.js'
import ChannelComponentHandler from './handler/ChannelComponentHandler.js'
import ListenerTypes from './ListenerTypes.js'

class ChannelComponentListener extends AbstractListener
{
    public readonly handler: ChannelComponentHandler

    public readonly channel: Discord.TextBasedChannel

    public readonly collector: Discord.InteractionCollector<Discord.MessageComponentInteraction>

	public constructor(listenerId: string, bot: Mel, handler: ChannelComponentHandler, channel: Discord.TextBasedChannel)
	{
		super(listenerId, bot, ListenerTypes.CHANNEL_COMPONENT)

		this.handler = handler
		this.channel = channel

		const dbListener = this.getDbListener()
		if (!dbListener)
		{
			throw new Error('DB listener not found')
		}

		const filter = (interaction: Discord.MessageComponentInteraction) =>
			handler.filter ? handler.filter(this, interaction) : true

		const options = handler.options
		if (dbListener.timeout !== undefined && dbListener.timeout >= 0)
		{
			options.time = dbListener.timeout - Date.now()
		}
		if (dbListener.idleTimeout !== undefined && dbListener.idleTimeout >= 0)
		{
			options.idle = dbListener.idleTimeout
		}

		this.collector = channel.createMessageComponentCollector({ filter, ...options })

		// Attach the handler to the collector
		this.collector
			.on('collect', this.onCollect.bind(this))
			.on('dispose', this.onDispose.bind(this))
			.on('end', this.onEnd.bind(this))
	}

	public static async create(listenerId: string, bot: Mel, handler: ChannelComponentHandler): Promise<ChannelComponentListener>
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

	protected async onCollect(interaction: Discord.MessageComponentInteraction): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, interaction)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener || dbListener.collected.includes(interaction.id))
			{
				return // Invalid or Already collected
			}

			// Collect and save state
			dbListener.collected.push(interaction.id)
			this.bot.state.save()
		}

		this.bot.logger.debug(`Interaction ${interaction.id} by ${interaction.user.username} collected in channel ${this.channel.id} (id: ${this.id})`, 'MessageComponentListener')

		try
		{
			this.handler.on.collect?.(this, interaction)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.collect', 'MessageComponentListener', error)
		}
	}

	protected async onDispose(interaction: Discord.MessageComponentInteraction): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, interaction)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener)
			{
				return // Invalid
			}

			const i = dbListener.collected.indexOf(interaction.id)
			if (i < 0)
			{
				return // Not collected
			}

			dbListener.collected.splice(i, 1) // Remove
			this.bot.state.save()
		}

		this.bot.logger.debug(`Interaction ${interaction.id} by ${interaction.user.username} disposed in channel ${this.channel.id} (id: ${this.id})`, 'MessageComponentListener')

		try
		{
			this.handler.on.dispose?.(this, interaction)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.dispose', 'MessageComponentListener', error)
		}
	}

	protected async onEnd(collected: any[], reason: string): Promise<void>
	{
		this.bot.logger.debug(`Interaction collection ended (reason: ${reason}) (id: ${this.id})`, 'MessageComponentListener')

		try
		{
			this.handler.on.end?.(this, collected, reason)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.end', 'MessageComponentListener', error)
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
			this.bot.logger.warn('An error occured in handler.on.delete', 'MessageComponentListener', error)
		}

		this.collector.stop('delete')
	}
}

export default ChannelComponentListener
