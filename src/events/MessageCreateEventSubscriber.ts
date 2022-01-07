import Discord from 'discord.js'

import SubscribedEventsType from './SubscribedEventsType'
import AbstractEventSubscriber from './AbstractEventSubscriber'

class MessageCreateEventSubscriber extends AbstractEventSubscriber
{
	public getSubscribedEvents(): SubscribedEventsType
	{
		return {
			'messageCreate': [
				{
					methodName: 'onMessageCreate',
					priority: 10,
				},
			],
		};
	}

	public async onMessageCreate(message: Discord.Message)
	{
		const contextConfig = this.mel.config.getContextConfig(message.guild?.id)

		// Ignore messages from bots
		if (contextConfig.ignoreBots && message.author.bot) return

		// Ignore messages if the bot is disabled in this context
		if (!contextConfig.enabled) return

		const { isCommand, content } = (() =>
			{
				// Check for a message command
				if (contextConfig.messageCommands
				    && message.content.startsWith(contextConfig.prefix))
				{
					return {
							isCommand: true,
							content: message.content.substring(contextConfig.prefix.length),
						}
				}

				// Check for a mention command
				if (contextConfig.mentionCommands)
				{
					// Check if the message starts by mentionning the bot
					const mentionMatch = message.content.match(/^<@!?([^>]+)>\s*(.*)$/is)
					if (mentionMatch && mentionMatch[1] === this.mel.client.user?.id)
					{
						return {
								isCommand: true,
								content: mentionMatch[2],
							}
					}
				}

				return {
						isCommand: false,
						content: message.content,
					}
			})()

		if (isCommand)
		{
			const { commandName, commandArgs } = (() =>
				{
					const commandMatch = content.match(/^([^\s]*)\s*(.*)$/is)
					if (commandMatch)
					{
						return {
							commandName: commandMatch[1],
							commandArgs: commandMatch[2],
						}
					}

					return {
						commandName: content,
						commandArgs: '',
					}
				})()

			this.mel.commands.onMessage(commandName, message, commandArgs)
		}
	}
}

export default MessageCreateEventSubscriber
