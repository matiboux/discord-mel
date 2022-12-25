import Discord from 'discord.js'

import SubscribedEventsType from './SubscribedEventsType.js'
import AbstractEventSubscriber from './AbstractEventSubscriber.js'

class InteractionCreateEventSubscriber extends AbstractEventSubscriber
{
	public getSubscribedEvents(): SubscribedEventsType
	{
		return {
			'interactionCreate': [
				{
					methodName: 'onInteractionCreate',
					priority: 10,
				},
			],
		};
	}

	public async onInteractionCreate(interaction: Discord.BaseInteraction)
	{
		const contextConfig = this.mel.config.getContextConfig(interaction.guild?.id)

		// Ignore interactions from bots
		if (contextConfig.ignoreBots && interaction.user.bot) return

		// Ignore interactions if the bot is disabled in this context
		if (!contextConfig.enabled)
		{
			const {
				consoleMessageKey,
				consoleMessageArgs,
				replyMessageKey,
				replyMessageArgs,
			} = (() =>
				{
					if (interaction.guild)
					{
						return {
							consoleMessageKey: 'interaction.disabled.guild.console',
							consoleMessageArgs: {
								'%guild%': `${interaction.guild.name} (${interaction.guild.id})`,
							},
							replyMessageKey: 'interaction.disabled.guild.reply',
							replyMessageArgs: {},
						}
					}

					if (interaction.channel)
					{
						return {
							consoleMessageKey: 'interaction.disabled.channel.console',
							consoleMessageArgs: {
								'%channel%': `${interaction.channel.id}`,
							},
							replyMessageKey: 'interaction.disabled.channel.reply',
							replyMessageArgs: {},
						}
					}

					return {
						consoleMessageKey: 'interaction.disabled.context',
						consoleMessageArgs: {},
						replyMessageKey: 'interaction.disabled.context',
						replyMessageArgs: {},
					}
				})()

			// Context is disabled
			this.mel.logger.debug(this.mel.translator.translate(consoleMessageKey, consoleMessageArgs))

			interaction.type === Discord.InteractionType.ApplicationCommand
			if (interaction.isCommand() || interaction.isMessageComponent())
			{
				// Reply to the interaction
				interaction.reply({
						content: this.mel.translator.translate(replyMessageKey, replyMessageArgs),
						ephemeral: true,
					})
			}

			return
		}

		if (interaction.isCommand())
		{
			// interaction.isCommand() || interaction.isContextMenu()
			this.mel.commands.onCommandInteraction(interaction)
		}
		else if (interaction.isMessageComponent())
		{
			// interaction.isButton() || interaction.isSelectMenu()
			this.mel.commands.onComponentInteraction(interaction)
		}
		else if (interaction.isAutocomplete())
		{
			this.mel.commands.onAutocompleteInteraction(interaction)
		}
		else
		{
			this.mel.logger.error(this.mel.translator.translate('interaction.unknown', {
					'%type%': interaction.type
				}))
		}
	}
}

export default InteractionCreateEventSubscriber
