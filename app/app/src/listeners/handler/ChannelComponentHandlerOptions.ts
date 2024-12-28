import Discord from 'discord.js'

class ChannelReactionHandlerOptions implements Discord.ReactionCollectorOptions
{
	public time?: number

	public idle?: number

	public dispose?: boolean

	public max?: number

	public maxEmojis?: number

	public maxUsers?: number

	public store: boolean = false

	public setTime(time?: number): this
	{
		this.time = time
		return this
	}

	public setIdle(idle?: number): this
	{
		this.idle = idle
		return this
	}

	public setDispose(dispose?: boolean): this
	{
		this.dispose = dispose
		return this
	}

	public setMax(max?: number): this
	{
		this.max = max
		return this
	}

	public setMaxEmojis(maxEmojis?: number): this
	{
		this.maxEmojis = maxEmojis
		return this
	}

	public setMaxUsers(maxUsers?: number): this
	{
		this.maxUsers = maxUsers
		return this
	}

	public setStore(store: boolean): this
	{
		this.store = store
		return this
	}
}

export default ChannelReactionHandlerOptions
