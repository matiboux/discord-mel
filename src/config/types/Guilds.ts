import { Snowflake } from 'discord-api-types'

import IUnserialize from '../../functions/IUnserialize'
import Guild from './Guild'

class Guilds extends Map<Snowflake, Guild> implements IUnserialize
{
	public unserialize(object: any): this
	{
		for (const key in object)
		{
			const guild = new Guild(object[key])
			this.set(key, guild)
		}

		return this
	}
}

export default Guilds
