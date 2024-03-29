import { Snowflake } from 'discord-api-types/v9'
import AbstractDBType from './AbstractDBType.js'

class DBListener extends AbstractDBType
{
    public type!: string

    public commandId!: string // Command name

    public variant?: string

    public timeout?: number

    public idleTimeout?: number

    public guildId?: Snowflake

    public channelId?: Snowflake

    public targetType?: string

    public targetId?: Snowflake

    public data!: { [key: string]: any }

    public collected!: any[]

    public lastCallTime!: number

    protected initProperties(): void
    {
        this.commandId = ''
        this.collected = []
        this.data = {}
        this.lastCallTime = Date.now()
    }
}

export default DBListener
