import fs from 'fs'

class Config
{
	[x: string]: any

	token?: string

	logPath?: string
	logFile?: string

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
			Object.assign(this, config)
		}
	}
}

export default Config
