import Mel from '../Mel.js'
import EventSubscriberInterface from './EventSubscriberInterface.js'
import SubscribedEventsType from './SubscribedEventsType.js'

abstract class AbstractEventSubscriber implements EventSubscriberInterface
{
	public readonly enabled: boolean = true

	protected mel: Mel

	public constructor(mel: Mel)
	{
		this.mel = mel
	}

	public abstract getSubscribedEvents(): SubscribedEventsType

	// public abstract on(...args: any[]): void
}

export default AbstractEventSubscriber
