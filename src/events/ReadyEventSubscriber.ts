import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9'

import SubscribedEventsType from './SubscribedEventsType'
import AbstractEventSubscriber from './AbstractEventSubscriber'

class ReadyEventSubscriber extends AbstractEventSubscriber
{
	public getSubscribedEvents(): SubscribedEventsType
	{
		return {
			'ready': [
				{
					methodName: 'onReady',
					priority: 10,
				},
			],
		};
	}

	public onReady()
	{
		this.mel.logger.info(this.mel.translator.translate('login.ready', {
				'%user%': this.mel.client.user?.tag
			}))

		if (this.mel.rest)
		{
			// Register slash commands in guilds
			this.mel.client.guilds.fetch()
				.then(guilds => guilds.forEach(guild =>
					{
						const slashCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
						this.mel.commands.forEach(command =>
							{
								command.applicationCommands
									.forEach(slashCommand => slashCommands.push(slashCommand.toJSON()))
							})

						if (this.mel.rest)
						{
							const clientId = this.mel.client.user?.id
							if (clientId)
							{
								this.mel.rest.put(Routes.applicationGuildCommands(clientId, guild.id),
											  { body: slashCommands })
									.then(() =>
										{
											this.mel.logger.info(this.mel.translator.translate('commands.guild.registered', {
													'%count%': slashCommands.length
												}))
										})
									.catch(error =>
										{
											this.mel.logger.error(this.mel.translator.translate('commands.guild.fail', {
													'%count%': slashCommands.length
												}))

											if (error.code === 50001)
												this.mel.logger.error(this.mel.translator.translate('scopes.missing.applications.commands'))
											else
												this.mel.logger.error(error)
										})
							}
						}
					}))
				.catch(this.mel.logger.warn)
		}
	}
}

export default ReadyEventSubscriber
