import Discord from 'discord.js'

import Translator from '../Translator'
import Logger from '../logger/Logger'
import Mel from '../Mel'
import AbstractListener from './AbstractListener'
import MessageReactionHandler from './handler/MessageReactionHandler'
import MessageReactionListener from './MessageReactionListener'
import AbstractListenerRegister from './register/AbstractListenerRegister'
import AbstractHandler from './handler/AbstractHandler'
import MessageHandler from './handler/MessageHandler'
import MessageListener from './MessageListener'

class ListenersManager
{
	protected readonly listeners: Map<string, AbstractListener> = new Map<string, AbstractListener>()

	protected bot: Mel
	protected logger: Logger
	protected translator: Translator

	constructor(bot: Mel)
	{
		this.bot = bot
		this.logger = this.bot.logger
		this.translator = this.bot.translator

		this.bot.hooks.add('ready', this.register.bind(this))
	}

	/**
	 * Generate a listener id that is currently not in use
	 */
	protected generateId(): string
	{
		for (let i = 0; i < 5; ++i)
		{
			const listenerId = Math.random().toString(36).substring(2)
			if (!this.listeners.has(listenerId))
			{
				// Generated listener id is not used
				return listenerId
			}
		}

		throw new Error('Failed to generate a unique listener id')
	}

	/**
	 * Register a new listener
	 *
	 * @param dbListener Listener register object
	 */
	public async add(dbListener: AbstractListenerRegister)
	{
		// Generate a listener id
		const listenerId = this.generateId()

		// Save the listener
		this.bot.state.db.listeners.set(listenerId, dbListener)

		// Register the listener
		return this.registerSingle(listenerId)
			.then(listener =>
				{
					this.logger.info(`Listener ${listener.constructor.name} registered (id: ${listenerId})`, 'ListenersManager')
					this.bot.state.save()

					return Promise.resolve(listener)
				})
			.catch(error =>
				{
					this.logger.error(`Failed to register the listener (id: ${listenerId})`, 'ListenersManager')
					this.bot.state.setState(db => db.listeners.delete(listenerId))
					this.listeners.delete(listenerId)

					return Promise.reject(error)
				})
	}

	/**
	 * Register a new listener for a target object
	 *
	 * @param object Target object
	 * @param dbListener Listener register object
	 */
	public async addFor(object: Discord.Message | Discord.Channel | Discord.Guild | Discord.User | Discord.GuildMember,
	                    dbListener: AbstractListenerRegister,
	                    )
	{
		if (!dbListener.guildID)
		{
			dbListener.guildID = (object as { guild: Discord.Guild | undefined }).guild?.id
		}

		if (!dbListener.channelID)
		{
			dbListener.channelID = (object as { channel: Discord.Channel | undefined }).channel?.id
		}

		// TODO: Save object information in the listener register

		return this.add(dbListener)
	}

	public get(listenerId: string): AbstractListener | undefined
	{
		return this.listeners.get(listenerId)
	}

	public has(listenerId: string): boolean
	{
		return this.listeners.has(listenerId)
	}

	public delete(listenerId: string): void
	{
		const listener = this.listeners.get(listenerId)
		if (listener)
		{
			// if (typeof this.bot.state.js.delete === 'function') this.bot.state.js.delete()
			listener.delete?.()

			this.logger.info(`Listener ${listener.constructor.name} deleted (id: ${listenerId})`, 'ListenersManager')
			this.bot.state.setState(db => db.listeners.delete(listenerId))
			this.listeners.delete(listenerId)
		}
	}

	protected async register(): Promise<void>
	{
		let registeredListeners = 0
		const promises = Array.from(this.bot.state.db.listeners.keys()).map(async listenerId =>
			{
				const registered = await this.registerSingle(listenerId).then(() => true).catch(() => false)
				if (registered)
				{
					++registeredListeners
				}
				else
				{
					this.logger.error(`Failed to register the listener (id: ${listenerId})`, 'ListenersManager')
					this.bot.state.db.listeners.delete(listenerId)
					this.bot.state.save()
				}
			})

		return Promise.all(promises).then(() =>
			{
				this.logger.info(this.translator.translate('listeners.registeredAll', {
						'%count%': registeredListeners,
					}))
			})
	}

	// Returns true if the listener was registered
	protected async registerSingle(listenerId: string)
	{
		const existingJsListener = this.listeners.get(listenerId)
		if (existingJsListener)
		{
			// Already registered
			return Promise.resolve(existingJsListener)
		}

		const dbListener = this.bot.state.db.listeners.get(listenerId)
		if (!dbListener)
		{
			return Promise.reject(new Error(`Cannot register listener: unknown listener (id: ${listenerId})`))
		}

		if (!dbListener.type || !dbListener.command)
		{
			return Promise.reject(new Error(`Cannot register listener: missing type or handler (id: ${listenerId})`))
		}

		const command = this.bot.commands.get(dbListener.command)

		const handler = (() =>
			{
				const handlerType = command?.handlers?.get(dbListener.type)
				if (!handlerType)
				{
					return undefined
				}

				if (dbListener.variant !== undefined)
				{
					if (handlerType instanceof AbstractHandler)
					{
						return undefined
					}

					const handlerVariant = handlerType.get(dbListener.variant)
					return handlerVariant ?? undefined
				}

				return handlerType instanceof AbstractHandler ? handlerType : undefined
			})()

		if (!handler)
		{
			return Promise.reject(new Error(`Cannot register listener: Invalid handler (id: ${listenerId})`))
		}

		if (!Array.isArray(dbListener.collected))
		{
			dbListener.collected = []
		}

		if (handler instanceof MessageHandler)
		{
			// Listen to messages from a user
			const user = await this.bot.client.users.fetch(objectID).catch(() => undefined)
			if (!user)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: User not found'))
			}

			// Register the listener
			const jsListener = new MessageListener(this.bot, handler, user)
			this.listeners.set(listenerId, jsListener)

			return Promise.resolve(jsListener)
		}
		else if (handler instanceof MessageReactionHandler)
		{
			if (!dbListener.channelID)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: Missing channel ID'))
			}

			// Listen to reactions on a message
			const channel =
				(await this.bot.client.channels.fetch(dbListener.channelID)
					.catch(() => undefined)
				) as (Discord.Channel & { messages: undefined }) | Discord.TextBasedChannels | undefined

			if (!channel || !channel.messages)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: Channel not found'))
			}

			const message = await channel.messages.fetch(objectID).catch(() => undefined)
			if (!message?.id)
			{
				return Promise.reject(new Error('Cannot register MessageReactionListener: Message not found'))
			}

			const filter = (reaction: Discord.MessageReaction, user: Discord.User) =>
				handler.filter ? handler.filter(message, reaction, user) : true

			const options = handler.options
			if (dbListener.timeout !== undefined && dbListener.timeout >= 0)
			{
				options.time = dbListener.timeout - Date.now()
			}
			if (dbListener.idleTimeout !== undefined && dbListener.idleTimeout >= 0)
			{
				options.idle = dbListener.idleTimeout
			}

			const collector = message.createReactionCollector({ filter, ...options })

			// Save the registered listener
			const jsListener = new MessageReactionListener(this.bot, handler, message, collector)
			this.listeners.set(listenerId, jsListener)

			return Promise.resolve(jsListener)
		}

		return Promise.reject(new Error());
	}
}

export default ListenersManager
