import SubscribedEventsType from './SubscribedEventsType.js'

interface EventSubscriberInterface
{
	getSubscribedEvents(): SubscribedEventsType

	// on(...args: any[]): void
}

export default EventSubscriberInterface
