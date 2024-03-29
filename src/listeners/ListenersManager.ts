import Discord from 'discord.js'

import Translator from '../Translator.js'
import Logger from '../logger/Logger.js'
import Mel from '../Mel.js'
import DBListener from '../state/db/types/DBListener.js'
import AbstractListener from './AbstractListener.js'
import MessageReactionHandler from './handler/MessageReactionHandler.js'
import MessageReactionListener from './MessageReactionListener.js'
import AbstractListenerRegister from './register/AbstractListenerRegister.js'
import AbstractHandler from './handler/AbstractHandler.js'
import MessageHandler from './handler/MessageHandler.js'
import MessageListener from './MessageListener.js'
import MessageComponentHandler from './handler/MessageComponentHandler.js'
import MessageComponentListener from './MessageComponentListener.js'

class ListenersManager
{
	protected readonly listeners: Map<string, AbstractListener> = new Map<string, AbstractListener>()

	protected bot: Mel
	protected logger: Logger
	protected translator: Translator

	public constructor(bot: Mel)
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
	public async add(dbListener: AbstractListenerRegister): Promise<AbstractListener>
	{
		// Generate a listener id
		const listenerId = this.generateId()

		// Save the listener
		this.bot.state.db.listeners.set(listenerId, new DBListener(dbListener))

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
	 * @param target Target object
	 * @param dbListener Listener register object
	 */
	public async addFor(target: Discord.Guild | Discord.Channel | Discord.GuildMember | Discord.User | Discord.Message,
	                    dbListener: AbstractListenerRegister,
	                    ): Promise<AbstractListener>
	{
		if (!dbListener.targetId)
		{
			// Save target object information in the listener register
			dbListener.setTarget(target)
		}

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
			listener.onDelete?.()

			this.logger.info(`Listener ${listener.constructor.name} deleted (id: ${listenerId})`, 'ListenersManager')
			this.bot.state.setState(db => db.listeners.delete(listenerId))
			this.listeners.delete(listenerId)
		}
	}

	protected async register(): Promise<void>
	{
		const promises = Array.from(this.bot.state.db.listeners.keys())
			.map(async listenerId =>
				this.registerSingle(listenerId)
					.then(listener =>
						{
							this.logger.debug(`Listener id ${listenerId} registered`, 'ListenersManager')
							return listener
						})
					.catch(error =>
						{
							this.logger.error(`Failed to register the listener (id: ${listenerId})`, 'ListenersManager', error)
							this.logger.debug(`Deleting the invalid listener id ${listenerId}`, 'ListenersManager')
							this.bot.state.db.listeners.delete(listenerId)
							this.bot.state.save()
							return Promise.reject()
						}))

		return Promise.allSettled(promises).then((results) =>
			{
				// Count the number of successful registered listeners
				const registered = results.reduce((sum, result) => result.status === 'fulfilled' ? sum + 1 : sum, 0)

				this.logger.info(this.translator.translate('listeners.registeredAll', {
						'%count%': registered,
					}))
			})
	}

	// Returns true if the listener was registered
	protected async registerSingle(listenerId: string): Promise<AbstractListener>
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

		if (!dbListener.type || !dbListener.commandId)
		{
			return Promise.reject(new Error(`Cannot register listener: missing type or handler (id: ${listenerId})`))
		}

		const command = this.bot.commands.get(dbListener.commandId)

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
			try
			{
				// Register the listener
				const jsListener = await MessageListener.create(listenerId, this.bot, handler)
				this.listeners.set(listenerId, jsListener)

				return Promise.resolve(jsListener)
			}
			catch (error)
			{
				this.logger.error(`Failed to register listener (id: ${listenerId})`, 'MessageListener')
				return Promise.reject(error)
			}
		}
		else if (handler instanceof MessageReactionHandler)
		{
			try
			{
				// Save the registered listener
				const jsListener = await MessageReactionListener.create(listenerId, this.bot, handler)
				this.listeners.set(listenerId, jsListener)

				return Promise.resolve(jsListener)
			}
			catch (error)
			{
				this.logger.error(`Failed to register listener (id: ${listenerId})`, 'MessageReactionListener')
				return Promise.reject(error)
			}
		}
		else if (handler instanceof MessageComponentHandler)
		{
			try
			{
				// Save the registered listener
				const jsListener = await MessageComponentListener.create(listenerId, this.bot, handler)
				this.listeners.set(listenerId, jsListener)

				return Promise.resolve(jsListener)
			}
			catch (error)
			{
				this.logger.error(`Failed to register listener (id: ${listenerId})`, 'ComponentListener')
				return Promise.reject(error)
			}
		}

		this.logger.error(`Unsupported handler: ${typeof handler} (id: ${listenerId})`, 'ListenersManager')
		return Promise.reject(new Error('Cannot register listener: Unsupported handler'))
	}
}

export default ListenersManager
