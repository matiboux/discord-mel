import { Snowflake } from 'discord-api-types'

import AbstractDBMapType from './AbstractDBMapType'
import Listener from './Listener'

class Listeners extends AbstractDBMapType<Snowflake, Listener>
{
	public unserialize(other: any): this
	{
		for (const key in other)
		{
			const guild = new Listener(other[key])
			this.set(key, guild)
		}

		return this
	}
}

export default Listeners
