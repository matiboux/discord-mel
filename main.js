'use strict'

const Discord = require('discord.js')

const client = new Discord.Client({
	intents: []
})

client.on('ready', () =>
	{
		console.log(`Logged in as ${client.user.tag}!`)
	})

// Start the bot
const config = require('./config.json')
client.login(config.token)
