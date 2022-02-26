import { Snowflake } from 'discord-api-types'

import AbstractDBMapType from './AbstractDBMapType'
import DBListener from './DBListener'

class DBListeners extends AbstractDBMapType<Snowflake, DBListener>
{
	public unserialize(other: any): this
	{
		for (const key in other)
		{
			const guild = new DBListener(other[key])
			this.set(key, guild)
		}

		return this
	}
}

export default DBListeners
