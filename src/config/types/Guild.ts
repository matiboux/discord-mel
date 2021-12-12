import assignDeep from '../../functions/assignDeep'
import Context from './Context'

class Guild extends Context
{
	public mergeWith(guild: Guild | Context): this
	{
		assignDeep(this, guild)
		return this
	}
}

export default Guild
