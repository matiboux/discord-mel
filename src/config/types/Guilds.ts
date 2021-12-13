import { Snowflake } from 'discord-api-types'
import Mergeable from '../../functions/Mergeable'
import Guild from './Guild'

class Guilds extends Map<Snowflake, Guild> implements Mergeable
{
	constructor()
	{
		super()
	}

	public mergeWith(object: any): this
	{
		for (const key in object)
		{
			this.set(key, object[key])
		}

		return this
	}
}

export default Guilds
