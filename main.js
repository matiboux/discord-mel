'use strict'

global.ABSPATH = __dirname

const Bot = require('./src/Bot')

const bot = new Bot({
	configFile: 'config.json',
}, {
	intents: [],
})

// Start the bot
bot.start()
