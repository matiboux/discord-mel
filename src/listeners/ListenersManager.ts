import Discord from 'discord.js'
import { Snowflake } from 'discord-api-types'

import Translator from '../Translator'
import Logger from '../logger/Logger'
import Mel from '../Mel'
import AbstractListener from './AbstractListener'
import MessageReactionHandler from './handler/MessageReactionHandler'
import MessageReactionListener from './MessageReactionListener'
import AbstractListenerRegister from './register/AbstractListenerRegister'
import AbstractHandler from './handler/AbstractHandler'

type ObjectType = Snowflake | Discord.Message

class ListenersManager
{
	protected readonly listeners: Map<Snowflake, AbstractListener> = new Map<Snowflake, AbstractListener>()

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
	 * Register a new listener
	 *
	 * @param object Object or Object ID
	 */
	public async add(object: ObjectType, dbListener: AbstractListenerRegister)
	{
		const objectId = typeof object === 'string' ? object : object.id;

		if (!objectId)
		{
			this.logger.error('Cannot create listener: invalid object or object id', 'ListenersManager')
			return
		}

		if (this.listeners.has(objectId))
		{
			this.logger.warn(`Overwriting listener on the object ${objectId}`, 'ListenersManager')
			this.delete(objectId)
		}

		if (typeof object !== 'string')
		{
			if (!dbListener.guildID)
			{
				dbListener.guildID = object.guild?.id
			}

			if (!dbListener.channelID)
			{
				dbListener.channelID = object.channel?.id
			}
		}

		this.bot.state.db.listeners.set(objectId, dbListener)

		return this.registerSingle(objectId)
			.then(listener =>
				{
					this.logger.info(`Listener ${listener.constructor.name} registered on the object ${objectId}`, 'ListenersManager')
					this.bot.state.save()

					return Promise.resolve(listener)
				})
			.catch(error =>
				{
					this.logger.error(`Failed to register listener on the object ${objectId}`, 'ListenersManager')
					this.bot.state.setState(db => db.listeners.delete(objectId))
					this.listeners.delete(objectId)

					return Promise.reject(error)
				})
	}

	public get(objectId: Snowflake): AbstractListener | undefined
	{
		return this.listeners.get(objectId)
	}

	public has(objectId: Snowflake): boolean
	{
		return this.listeners.has(objectId) // this.bot.state.db.listeners.has(objectID)
	}

	public delete(objectId: Snowflake): void
	{
		const listener = this.listeners.get(objectId)
		if (listener)
		{
			// if (typeof this.bot.state.js.delete === 'function') this.bot.state.js.delete()
			listener.delete?.()

			this.logger.info(`Listener ${listener.constructor.name} deleted from the object ${objectId}`, 'ListenersManager')
			this.bot.state.setState(db => db.listeners.delete(objectId))
			this.listeners.delete(objectId)
		}
	}

	protected async register(): Promise<void>
	{
		let registeredListeners = 0
		const promises = Array.from(this.bot.state.db.listeners.keys()).map(async objectId =>
			{
				const registered = await this.registerSingle(objectId).then(() => true).catch(() => false)
				if (registered)
				{
					++registeredListeners
				}
				else
				{
					console.error(`Failed to register the listener on ${objectId}`)
					this.bot.state.db.listeners.delete(objectId)
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
	protected async registerSingle(objectID: Snowflake)
	{
		if (!objectID)
		{
			return Promise.reject(new Error())
		}

		const existingJsListener = this.listeners.get(objectID)
		if (existingJsListener)
		{
			// Already registered
			return Promise.resolve(existingJsListener)
		}

		const dbListener = this.bot.state.db.listeners.get(objectID)

		if (!dbListener || !dbListener.type || !dbListener.command)
		{
			return Promise.reject(new Error('Cannot register listener: missing type or handler'))
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
			return Promise.reject(new Error('Cannot register listener: Invalid handler'))
		}

		if (!Array.isArray(dbListener.collected))
		{
			dbListener.collected = []
		}

		if (handler instanceof MessageReactionHandler)
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
			const jsListener = new MessageReactionListener(this.bot, handler, message, collector)

			this.listeners.set(objectID, jsListener)

			return Promise.resolve(jsListener)
		}

		return Promise.reject(new Error());
	}
}

export default ListenersManager
