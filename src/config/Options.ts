import Config from './Config'
import IOptions from './IOptions'

class Options implements IOptions
{
	[x: string]: any

	absPath: string = __dirname

	config?: Config

	configPath?: string
	configFile?: string

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
		Object.assign(this, options)
	}
}

export default Options
