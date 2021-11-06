'use strict'

global.ABSPATH = __dirname

const Bot = require('./src/Bot')

const bot = new Bot({
	configFile: 'config.json',
}, {
	intents: [
		Bot.Intents.FLAGS.GUILDS,
		Bot.Intents.FLAGS.GUILD_MESSAGES,
		Bot.Intents.FLAGS.DIRECT_MESSAGES,
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

// Start the bot
bot.start()
