import fs from 'fs'
import assignDeep from '../functions/assignDeep'
import IConfig from './IConfig'
import Guild from './types/Guild'
import Guilds from './types/Guilds'

class DefaultConfig implements IConfig
{
	public static readonly assignDeep = assignDeep

	public absPath: string = __dirname

	public token?: string

	public logPath?: string
	public logFile?: string
	public logLevel?: string

	public statePath?: string
	public stateFile?: string

	public translationsDir?: string
	public defaultLanguage?: string = 'en'

	public commandsDir?: string
	public prefix?: string

	public guilds: Guilds = new Guilds()
	public guildDefault: Guild = new Guild()
	private guildConfigs: Guilds = new Guilds()

	public loadConfigFile(configFile?: string, charset: BufferEncoding = 'utf8')
	{
		if (configFile)
		{
			const config = JSON.parse(fs.readFileSync(configFile, { encoding: charset }))
			assignDeep(this, config)

			this.guildConfigs.clear()
		}
	}

	public mergeWith(config: IConfig): this
	{
		assignDeep(this, config)
		return this
	}

	public getGuildConfig(guildId: string): Guild
	{
		const guildConfig = this.guildConfigs.get(guildId)
		if (guildConfig)
		{
			return guildConfig
		}

		const newGuildConfig = new Guild()
		newGuildConfig.mergeWith(this.guildDefault)

		const guild = this.guilds.get(guildId)
		if (guild)
		{
			newGuildConfig.mergeWith(guild)
		}

		this.guildConfigs.set(guildId, newGuildConfig)
		return newGuildConfig
	}
}

export
{
	DefaultConfig,
	Guild,
	Guilds,
}

export default DefaultConfig
