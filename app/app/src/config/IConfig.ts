import Global from './types/Global.js'
import Guild from './types/Guild.js'
import Guilds from './types/Guilds.js'
import ServicesConfigType from './types/ServicesConfigType.js'

interface IConfig
{
	[x: string]: any

	absPath: string

	token?: string

	logPath?: string
	logFile?: string
	logLevel?: string

	statePath?: string
	stateFile?: string

	translationsDir?: string
	defaultLanguage?: string

	commandsDir?: string

	global: Global
	guildDefault: Guild
	guilds: Guilds

	services: ServicesConfigType
}

export default IConfig
