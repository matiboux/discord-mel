import ServiceConfigType from '../config/types/ServiceConfigType'
import Mel from '../Mel'
import AbstractService from './AbstractService'

type Service =
	(new (name: string, config?: ServiceConfigType, bot?: Mel) => AbstractService) &
	{ [K in keyof typeof AbstractService]: typeof AbstractService[K] }

export default Service
