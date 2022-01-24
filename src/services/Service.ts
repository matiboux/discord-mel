import Mel from '../Mel'
import AbstractService from './AbstractService'

type Service =
	(new (name: string, bot?: Mel) => AbstractService) &
	{ [K in keyof typeof AbstractService]: typeof AbstractService[K] }

export default Service
