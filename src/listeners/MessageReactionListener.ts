import Discord from 'discord.js'
import Mel from '../Mel'

import AbstractListener from './AbstractListener'
import MessageReactionHandler from './handler/MessageReactionHandler'
import ListenerTypes from './ListenerTypes'

class MessageReactionListener extends AbstractListener
{
    public readonly handler: MessageReactionHandler

    public readonly message: Discord.Message

    public readonly collector: Discord.ReactionCollector

	public constructor(listenerId: string, bot: Mel, handler: MessageReactionHandler, message: Discord.Message)
	{
		super(listenerId, bot, ListenerTypes.MESSAGE)

		this.handler = handler
		this.message = message

		const dbListener = this.getDbListener()
		if (!dbListener)
		{
			throw new Error('DB listener not found')
		}

		const filter = (reaction: Discord.MessageReaction, user: Discord.User) =>
			handler.filter ? handler.filter(this, reaction, user) : true

		const options = handler.options
		if (dbListener.timeout !== undefined && dbListener.timeout >= 0)
		{
			options.time = dbListener.timeout - Date.now()
		}
		if (dbListener.idleTimeout !== undefined && dbListener.idleTimeout >= 0)
		{
			options.idle = dbListener.idleTimeout
		}

		this.collector = message.createReactionCollector({ filter, ...options })

		// Attach the handler to the collector
		this.collector
			.on('collect', this.onCollect.bind(this))
			.on('remove', this.onRemove.bind(this))
			.on('dispose', this.onDispose.bind(this))
			.on('end', this.onEnd.bind(this))
	}

	public static async create(listenerId: string, bot: Mel, handler: MessageReactionHandler): Promise<MessageReactionListener>
	{
		const dbListener = bot.state.db.listeners.get(listenerId)
		if (!dbListener)
		{
			throw new Error('DB listener not found')
		}

		if (!dbListener.channelId)
		{
			throw new Error('Missing channel ID')
		}

		if (!dbListener.targetId)
		{
			throw new Error('Missing target message ID')
		}

		// Listen to reactions on a message
		const channel =
			(await bot.client.channels.fetch(dbListener.channelId)
				.catch(() => undefined)
			) as (Discord.Channel & { messages: undefined }) | Discord.TextBasedChannels | undefined

		if (!channel || !channel.messages)
		{
			throw new Error('Channel not found')
		}

		const message = await channel.messages.fetch(dbListener.targetId).catch(() => undefined)
		if (!message?.id)
		{
			throw new Error('Message not found')
		}

		return new this(listenerId, bot, handler, message)
	}

	protected async onCollect(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, reaction, user)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener || dbListener.collected.includes(user.id))
			{
				return // Invalid or Already collected
			}

			// Collect and save state
			dbListener.collected.push(user.id)
			this.bot.state.save()
		}

		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} collected on message ${this.message.id} (id: ${this.id})`, 'MessageReactionListener')

		try
		{
			this.handler.on.collect?.(this, reaction, user)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.collect', 'MessageListener', error)
		}
	}

	protected async onRemove(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this, reaction, user)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.id)

			if (!dbListener)
			{
				return // Invalid
			}

			const i = dbListener.collected.indexOf(user.id)
			if (i < 0)
			{
				return // Not collected
			}

			dbListener.collected.splice(i, 1) // Remove
			this.bot.state.save()
		}

		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} removed on message ${this.message.id} (id: ${this.id})`, 'MessageReactionListener')

		try
		{
			this.handler.on.remove?.(this, reaction, user)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.remove', 'MessageListener', error)
		}
	}

	protected async onDispose(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} disposed on message ${this.message.id} (id: ${this.id})`, 'MessageReactionListener')

		try
		{
			this.handler.on.dispose?.(this, reaction, user)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.dispose', 'MessageListener', error)
		}
	}

	protected async onEnd(collected: any[], reason: string): Promise<void>
	{
		this.bot.logger.debug(`Reaction collection ended (reason: ${reason}) (id: ${this.id})`, 'MessageReactionListener')

		try
		{
			this.handler.on.end?.(this, collected, reason)
		}
		catch (error: any)
		{
			this.bot.logger.warn('An error occured in handler.on.end', 'MessageListener', error)
		}

		// Delete listener
		this.bot.listeners.delete(this.id)
	}

	public end(reason: string = 'user'): void
	{
		this.collector.stop(reason)
		super.end(reason)
	}

	public delete(): void
	{
		this.handler.on.delete?.(this)
		this.collector.stop('delete')
	}
}

export default MessageReactionListener
