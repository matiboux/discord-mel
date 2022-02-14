import Discord from 'discord.js'
import Mel from '../Mel'

import AbstractListener from './AbstractListener'
import MessageReactionHandler from './handler/MessageReactionHandler'
import ListenerTypes from './ListenerTypes'

class MessageReactionListener extends AbstractListener
{
    public readonly bot: Mel

    public readonly handler: MessageReactionHandler

    public readonly message: Discord.Message

    public readonly collector: Discord.ReactionCollector

	public constructor(bot: Mel, handler: MessageReactionHandler, message: Discord.Message, collector: Discord.ReactionCollector)
	{
		super(ListenerTypes.MESSAGE_REACTION)
		this.bot = bot
		this.handler = handler
		this.message = message
		this.collector = collector

		// Attach the handler to the collector
		this.collector
			.on('collect', this.onCollect.bind(this))
			.on('remove', this.onRemove.bind(this))
			.on('dispose', this.onDispose.bind(this))
			.on('end', this.onEnd.bind(this))
	}

	protected async onCollect(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		if (this.handler.asyncfilter && !await this.handler.asyncfilter(this.message, reaction, user))
		{
			return
		}

		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this.message, reaction, user)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.message.id)

			if (!dbListener || dbListener.collected.includes(user.id))
			{
				return // Invalid or Already collected
			}

			// Collect and save state
			dbListener.collected.push(user.id)
			this.bot.state.save()
		}

		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} collected on message ${this.message.id}`, 'MessageReactionHandler')
		this.handler.on.collect?.(this.message, reaction, user)
	}

	protected async onRemove(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		if (this.handler.asyncfilter && !await this.handler.asyncfilter(this.message, reaction, user))
		{
			return
		}

		if (this.handler.options.store && (!this.handler.storefilter || this.handler.storefilter(this.message, reaction, user)))
		{
			const dbListener = this.bot.state.db.listeners.get(this.message.id)

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

		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} removed on message ${this.message.id}`, 'MessageReactionHandler')
		this.handler.on.remove?.(this.message, reaction, user);
	}

	protected async onDispose(reaction: Discord.MessageReaction, user: Discord.User): Promise<void>
	{
		if (this.handler.asyncfilter && !await this.handler.asyncfilter(this.message, reaction, user))
		{
			return
		}

		this.bot.logger.debug(`Reaction ${reaction.emoji.name} by ${user.username} disposed on message ${this.message.id}`, 'MessageReactionHandler')
		this.handler.on.dispose?.(this.message, reaction, user);
	}

	protected async onEnd(collected: any[], reason: string): Promise<void>
	{
		this.handler.on.end?.(this.message, collected, reason);

		// Delete listener
		this.bot.logger.debug(`Reaction collection ended on message ${this.message.id}`, 'MessageReactionHandler')
		this.bot.listeners.delete(this.message.id);
	}

	public delete()
	{
		this.handler.on.delete?.()
		this.collector.stop('delete')
	}
}

export default MessageReactionListener
