import __dirname from '../__dirname.js'
import IOptions from './IOptions.js'
import Logger from '../logger/Logger.js'
import unserialize from '../functions/unserialize.js'
import IConfig from './IConfig.js'

class Options implements IOptions
{
	[x: string]: any

	public absPath: string = __dirname

	public token?: string

	public config?: IConfig
	public configPath?: string
	public configFile?: string

	public logger?: Logger
	public logPath?: string
	public logFile?: string
	public logLevel?: string

	public statePath?: string
	public stateFile?: string

	public translationsDir?: string
	public defaultLanguage?: string

	public commandsDir?: string
	public prefix?: string

	public constructor(...optionsArray: IOptions[])
	{
		optionsArray.forEach(options =>
			{
				unserialize(this, options)
			})
	}
}

export default Options
