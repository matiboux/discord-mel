import SubscribedEventsType from './SubscribedEventsType.js'
import AbstractEventSubscriber from './AbstractEventSubscriber.js'

class ErrorEventSubscriber extends AbstractEventSubscriber
{
	public getSubscribedEvents(): SubscribedEventsType
	{
		return {
			'debug': [
				{
					methodName: 'onDebug',
					priority: 10,
				},
			],
			'error': [
				{
					methodName: 'onError',
					priority: 10,
				},
			],
			'shardError': [
				{
					methodName: 'onShardError',
					priority: 10,
				},
			],
		};
	}

	public async onDebug(info: string)
	{
		this.mel.logger.debug(info, 'djs.debug')
	}

	public async onError(error: Error)
	{
		this.mel.logger.error(error, 'djs.error')
	}

	public async onShardError(error: Error, shardId: number)
	{
		this.mel.logger.error(error, 'djs.shardError')
	}
}

export default ErrorEventSubscriber
