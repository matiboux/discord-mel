'use strict';

class Config
{
	token = null

	commandsDir = null

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
