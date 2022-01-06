import Mel from '../Mel'
import EventSubscriberInterface from './EventSubscriberInterface'
import SubscribedEventsType from './SubscribedEventsType'

abstract class AbstractEventSubscriber implements EventSubscriberInterface
{
	public readonly enabled: boolean = true

	protected mel: Mel

	constructor(mel: Mel)
	{
		this.mel = mel
	}

	public abstract getSubscribedEvents(): SubscribedEventsType

	// public abstract on(...args: any[]): void
}

export default AbstractEventSubscriber
