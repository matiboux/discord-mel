import { Mel } from '..'
import AbstractEventSubscriber from './AbstractEventSubscriber'

type EventSubscriber =
	(new (bot: Mel) => AbstractEventSubscriber) &
	{ [K in keyof typeof AbstractEventSubscriber]: typeof AbstractEventSubscriber[K] }


export default EventSubscriber
