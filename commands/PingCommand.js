const { SlashCommandBuilder } = require("@discordjs/builders");
const AbstractCommand = require("../src/commands/AbstractCommand");

class PingCommand extends AbstractCommand
{
	constructor()
	{
		super('ping')

		this.description = 'Ping!'
		this.cooldown = 5
	}

	async onMessage(message)
	{
		message.reply(this.translator.translate('ping.pong'))
	}

	async onInteraction(interaction)
	{
		interaction.reply(this.translator.translate('ping.pong'))
	}

	getApplicationCommand()
	{
		const slashCommand = new SlashCommandBuilder()
		slashCommand.setName(this.name)
		slashCommand.setDescription(this.description)

		return slashCommand
	}
}

module.exports = PingCommand
