'use strict';

const Bot = require('./Bot');

class Base
{
	/**
	 * @type {Bot}
	 */
	_bot = undefined

	/**
	 * @param {Bot} bot
	 */
	_setBot(bot)
	{
		this._bot = bot
	}

	get translator()
	{
		return this._bot?.translator
	}
}

module.exports = Base
