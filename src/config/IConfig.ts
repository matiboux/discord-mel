interface IConfig
{
	[x: string]: any

	token?: string

	statePath?: string
	stateFile?: string

	translationsDir?: string
	defaultLanguage?: string

	commandsDir?: string
	prefix?: string
}

export default IConfig
