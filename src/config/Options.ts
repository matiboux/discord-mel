import DefaultConfig from './DefaultConfig'
import IOptions from './IOptions'
import Logger from '../logger/Logger'
import assignDeep from '../functions/assignDeep'

class Options implements IOptions
{
	[x: string]: any

	absPath: string = __dirname

	config?: DefaultConfig
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

	constructor(...optionsArray: IOptions[])
	{
		optionsArray.forEach(options => this.set(options))
	}

	set(options: IOptions)
	{
		assignDeep(this, options)
	}
}

export default Options
