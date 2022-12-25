import { Snowflake } from 'discord-api-types/v9'

import AbstractDBMapType from './AbstractDBMapType.js'
import DBListener from './DBListener.js'

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
