import IConfig from './IConfig'

interface IOptions
{
	[x: string]: any

	absPath: string

	config?: IConfig

	configPath?: string
	configFile?: string

	statePath?: string
	stateFile?: string

	translationsDir?: string
	defaultLanguage?: string

	commandsDir?: string
	prefix?: string
}

export default IOptions
