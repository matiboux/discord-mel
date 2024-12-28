import Logger from '../logger/Logger.js'
import IConfig from './IConfig.js'

interface IOptions
{
	[x: string]: any

	absPath: string

	config?: IConfig
	configPath?: string
	configFile?: string

	logger?: Logger
	logPath?: string
	logFile?: string
	logLevel?: string

	statePath?: string
	stateFile?: string

	translationsDir?: string
	defaultLanguage?: string

	commandsDir?: string
	prefix?: string
}

export default IOptions
