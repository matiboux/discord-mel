class Config
{
	[x: string]: any

	token: string | undefined = undefined

	commandsDir: string | undefined = undefined
	translationsDir: string | undefined = undefined
	defaultLanguage: string | undefined = 'en'
	prefix: string | undefined = undefined

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
