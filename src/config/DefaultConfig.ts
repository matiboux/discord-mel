import fs from 'fs'
import assignDeep from '../functions/assignDeep'
import IConfig from './IConfig'

class DefaultConfig implements IConfig
{
	public static readonly assignDeep = assignDeep

	public absPath: string = __dirname

	public token?: string

	public logPath?: string
	public logFile?: string
	public logLevel?: string

	public statePath?: string
	public stateFile?: string

	public translationsDir?: string
	public defaultLanguage?: string = 'en'

	public commandsDir?: string
	public prefix?: string

	public loadConfigFile(configFile?: string, charset: BufferEncoding = 'utf8')
	{
		if (configFile)
		{
			const config = JSON.parse(fs.readFileSync(configFile, { encoding: charset }))
			assignDeep(this, config)
		}
	}
}

export default DefaultConfig
