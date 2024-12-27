import Mel from '../Mel.js'
import AbstractEventSubscriber from './AbstractEventSubscriber.js'

type EventSubscriber =
	(new (bot: Mel) => AbstractEventSubscriber) &
	{ [K in keyof typeof AbstractEventSubscriber]: typeof AbstractEventSubscriber[K] }


export default EventSubscriber
