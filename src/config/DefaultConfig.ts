import fs from 'fs'
import assignDeep from '../functions/assignDeep'

class DefaultConfig
{
	[x: string]: any

	token?: string

	logPath?: string
	logFile?: string
	logLevel?: string

	statePath?: string
	stateFile?: string

	commandsDir?: string
	translationsDir?: string
	defaultLanguage?: string = 'en'
	prefix?: string

	constructor(configFile?: string, charset: BufferEncoding = 'utf8')
	{
		if (configFile)
		{
			const config = JSON.parse(fs.readFileSync(configFile, { encoding: charset }))
			assignDeep(this, config)
		}
	}
}

export default DefaultConfig
