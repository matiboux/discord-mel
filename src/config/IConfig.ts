interface IConfig
{
	[x: string]: any

	token?: string

	logPath?: string
	logFile?: string

	statePath?: string
	stateFile?: string

	translationsDir?: string
	defaultLanguage?: string

	commandsDir?: string
	prefix?: string
}

export default IConfig
