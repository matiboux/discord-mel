import Global from './types/Global'
import Guild from './types/Guild'
import Guilds from './types/Guilds'

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
}

export default IConfig
