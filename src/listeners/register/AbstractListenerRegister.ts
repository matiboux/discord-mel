import Discord from 'discord.js'
import { Snowflake } from 'discord-api-types'

import DBListener from '../../state/db/types/Listener'
import ListenerTypes from '../ListenerTypes'
import ListenerTargetTypes from './ListenerTargetTypes'

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
        this.guildId = typeof guild === 'string' ? guild : guild?.id
        return this
    }

    public setChannel(channel?: Snowflake | Discord.TextBasedChannels | Discord.VoiceChannel | Discord.Channel): this
    {
        this.channelId = typeof channel === 'string' ? channel : channel?.id
        return this
    }

    public setTargetType(targetType?: string): this
    {
        this.targetType = targetType
        return this
    }

    public setTargetId(targetId?: Snowflake): this
    {
        this.targetId = targetId
        return this
    }

    public setTarget(target: Discord.Guild | Discord.GuildChannel | Discord.Channel | Discord.GuildMember | Discord.User | Discord.Message): this
    {
        // Discord Guild
        if (target instanceof Discord.Guild)
        {
            // Guild
            this.setTargetType(ListenerTargetTypes.GUILD)
        }

        // Discord Channel
        else if (target instanceof Discord.GuildChannel)
        {
            // Channel in a guild
            this.setTargetType(ListenerTargetTypes.CHANNEL)
            !this.guildId && this.setGuild(target.guild)
        }
        else if (target instanceof Discord.Channel)
        {
            // Channel not in a guild
            this.setTargetType(ListenerTargetTypes.CHANNEL)
        }

        // Discord User
        else if (target instanceof Discord.GuildMember)
        {
            // User in a guild
            this.setTargetType(ListenerTargetTypes.USER)
            !this.guildId && this.setGuild(target.guild)
        }
        else if (target instanceof Discord.User)
        {
            // User not in a guild
            this.setTargetType(ListenerTargetTypes.USER)
        }

        // Discord Message
        else if (target instanceof Discord.Message)
        {
            this.setTargetType(ListenerTargetTypes.MESSAGE)
            !this.guildId && target.guild && this.setGuild(target.guild)
            !this.channelId && this.setChannel(target.channel)
        }

        this.setTargetId(target.id)
        return this
    }

    public setData(data: { [key: string]: any }): this
    {
        this.data = data
        return this
    }
}

export default AbstractListenerRegister
