import fs from 'fs'

import __abspath from '../__abspath.js'
import serialize from '../functions/serialize.js'
import unserialize from '../functions/unserialize.js'
import IConfig from './IConfig.js'
import AbstractContext from './types/AbstractContext.js'
import Global from './types/Global.js'
import Guild from './types/Guild.js'
import Guilds from './types/Guilds.js'
import ServicesConfigType from './types/ServicesConfigType.js'

abstract class AbstractConfig implements IConfig
{
	public static readonly serialize = serialize
	public static readonly unserialize = unserialize

	public absPath: string = __abspath

	public token?: string

	public logPath?: string
	public logFile?: string
	public logLevel?: string

	public statePath?: string
	public stateFile?: string

	public translationsDir?: string
	public defaultLanguage?: string = 'en'

	public commandsDir?: string

	public global: Global = new Global()
	public guildDefault: Guild = new Guild()
	public guilds: Guilds = new Guilds()
	protected guildConfigs: Guilds = new Guilds()

	public services: ServicesConfigType = new ServicesConfigType()

	public loadConfigFile(configFile?: string, charset: BufferEncoding = 'utf8')
	{
		if (configFile)
		{
			const config = JSON.parse(fs.readFileSync(configFile, { encoding: charset }))
			unserialize(this, config)

			this.onConfigLoaded()
		}
	}

	protected onConfigLoaded()
	{
		this.guildConfigs.clear()
	}

	public getGlobalConfig(contextGuild?: Global): Global
	{
		const contextConfig = contextGuild ?? new Global()
		unserialize(contextConfig, this.global)
		return contextConfig
	}

	public getGuildConfig(guildId: string, contextGuild?: Guild): Guild
	{
		const guildConfig = this.guildConfigs.get(guildId)
		if (guildConfig)
		{
			return guildConfig
		}

		const contextConfig = contextGuild ?? new Guild()
		unserialize(contextConfig, this.global)
		unserialize(contextConfig, this.guildDefault)

		const guild = this.guilds.get(guildId)
		if (guild)
		{
			unserialize(contextConfig, guild)
		}

		this.guildConfigs.set(guildId, contextConfig)
		return contextConfig
	}

	public getContextConfig(guildId?: string): AbstractContext
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
	AbstractConfig,
	AbstractContext,
	Global,
	Guild,
	Guilds,
}

export default AbstractConfig
