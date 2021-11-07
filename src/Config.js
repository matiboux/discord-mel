'use strict';

class Config
{
	token = null

	commandsDir = null
	translationsDir = null
	defaultLanguage = 'en'
	prefix = null

	constructor(configFile)
	{
		if (configFile)
		{
			const config = require(configFile)
			Object.assign(this, config)
		}
	}
}

module.exports = Config
