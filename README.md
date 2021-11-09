# Mel Discord bot framework

<img src="https://discordapp.com/assets/e4923594e694a21542a489471ecffa50.svg" width="200" />

Modulable Discord bot framework

## Get started

Use the framework in your dicord bot project:
```
npm i discord-mel
```

And then get started with this code:
```js
const { Bot } = require('discord-mel')

const bot = new Bot({
	absPath: __dirname,
	configFile: 'config.json',
}, {
	intents: [],
})

// Start the bot
bot.start()
```

You'll need to create the `config.json`.
See the [`config.default.json`](config.default.json) file as an example.
