class Config
{
	[x: string]: any

	token?: string

	commandsDir?: string
	translationsDir?: string
	defaultLanguage: string | undefined = 'en'
	prefix?: string

	constructor(configFile: string | null)
	{
		if (configFile)
		{
			const config = require(configFile)
			Object.assign(this, config)
		}
	}
}

export default Config
