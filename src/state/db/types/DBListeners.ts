import { Snowflake } from 'discord-api-types'

import AbstractDBMapType from './AbstractDBMapType'
import DBListener from './DBListener'

class DBListeners extends AbstractDBMapType<Snowflake, DBListener>
{
	public unserialize(object: any): this
	{
		for (const key in object)
		{
			const guild = new DBListener(object[key])
			this.set(key, guild)
		}

		return this
	}
}

export default DBListeners
