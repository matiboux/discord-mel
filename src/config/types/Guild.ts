import assignDeep from '../../functions/assignDeep'

class Guild
{
	/**	Whether the bot is enabled on this server */
	public enabled: boolean = true

	public mergeWith(guild: Guild): this
	{
		assignDeep(this, guild)
		return this
	}
}

export default Guild
