import SubscribedEventsType from './SubscribedEventsType'

interface EventSubscriberInterface
{
	getSubscribedEvents(): SubscribedEventsType

	// on(...args: any[]): void
}

export default EventSubscriberInterface
