import { Snowflake } from 'discord-api-types'
import Mergeable from '../../functions/Mergeable'
import Guild from './Guild'

class Guilds extends Map<Snowflake, Guild> implements Mergeable
{
	public mergeWith(object: any): this
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
