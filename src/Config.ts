import fs from 'fs'

class Config
{
	[x: string]: any

	token?: string

	statePath?: string
	stateFile?: string

	commandsDir?: string
	translationsDir?: string
	defaultLanguage: string | undefined = 'en'
	prefix?: string

	constructor(configFile: string | null, charset: BufferEncoding = 'utf8')
	{
		if (configFile)
		{
			const config = JSON.parse(fs.readFileSync(configFile, { encoding: charset }))
			Object.assign(this, config)
		}
	}
}

export default Config
