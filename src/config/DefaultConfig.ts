import fs from 'fs'
import assignDeep from '../functions/assignDeep'
import IConfig from './IConfig'
import Global from './types/Global'
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

	public global: Global = new Global()
	public guildDefault: Guild = new Guild()
	public guilds: Guilds = new Guilds()
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

	public getGlobalConfig(): Guild
	{
		const contextConfig = new Guild()
		contextConfig.mergeWith(this.global)
		return contextConfig
	}

	public getGuildConfig(guildId: string): Guild
	{
		const guildConfig = this.guildConfigs.get(guildId)
		if (guildConfig)
		{
			return guildConfig
		}

		const contextConfig = new Guild()
		contextConfig.mergeWith(this.global)
		contextConfig.mergeWith(this.guildDefault)

		const guild = this.guilds.get(guildId)
		if (guild)
		{
			contextConfig.mergeWith(guild)
		}

		this.guildConfigs.set(guildId, contextConfig)
		return contextConfig
	}

	public getContextConfig(guildId?: string): Guild
	{
		if (guildId !== undefined)
		{
			return this.getGuildConfig(guildId)
		}
		else
		{
			return this.getGlobalConfig()
		}
	}
}

export
{
	DefaultConfig,
	Guild,
	Guilds,
}

export default DefaultConfig
