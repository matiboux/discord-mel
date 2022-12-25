import ServiceConfigType from '../config/types/ServiceConfigType.js'
import Mel from '../Mel.js'
import AbstractService from './AbstractService.js'

type Service =
	(new (name: string, config?: ServiceConfigType, bot?: Mel) => AbstractService) &
	{ [K in keyof typeof AbstractService]: typeof AbstractService[K] }

export default Service
