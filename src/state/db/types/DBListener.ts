import { Snowflake } from 'discord-api-types'
import AbstractDBType from './AbstractDBType'

class DBListener extends AbstractDBType
{
    public type!: string

    public command!: string // Command name

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

	public constructor(type?: AbstractDBType)
	{
		super(type)

		if (this.type as any === undefined)
		{
			this.type = ''
		}

        if (this.command as any === undefined)
        {
            this.command = ''
        }

        if (this.collected as any === undefined)
        {
            this.collected = []
        }

        if (this.data as any === undefined)
        {
            this.data = {}
        }

        if (this.lastCallTime as any === undefined)
        {
            this.lastCallTime = Date.now()
        }
	}
}

export default DBListener
