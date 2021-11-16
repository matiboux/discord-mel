import Config from './Config'

interface IOptions
{
	[x: string]: any

	absPath: string

	config?: Config

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
