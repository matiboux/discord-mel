import { Snowflake } from 'discord-api-types/v9'

import IUnserialize from '../../functions/IUnserialize.js'
import Guild from './Guild.js'

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
