import Discord from 'discord.js'
import { Snowflake } from 'discord-api-types'

import DBListener from '../../state/db/types/Listener'
import ListenerTypes from '../ListenerTypes'

abstract class AbstractListenerRegister extends DBListener
{
	public constructor(type: ListenerTypes)
	{
		super()

        this.type = type
	}

    public setCommand(command: string): this
    {
        this.command = command
        return this
    }

    public setVariant(variant?: string): this
    {
        this.variant = variant
        return this
    }

    public setTimeout(timeout?: number): this
    {
        this.timeout = timeout
        return this
    }

    public setIdleTimeout(idleTimeout?: number): this
    {
        this.idleTimeout = idleTimeout
        return this
    }

    public setGuild(guild?: Snowflake | Discord.Guild): this
    {
        this.guildID = typeof guild === 'string' ? guild : guild?.id
        return this
    }

    public setChannel(channel?: Snowflake | Discord.Channel): this
    {
        this.channelID = typeof channel === 'string' ? channel : channel?.id
        return this
    }

    public setData(data: { [key: string]: any }): this
    {
        this.data = data
        return this
    }
}

export default AbstractListenerRegister
