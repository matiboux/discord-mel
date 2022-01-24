import Mel from '../Mel'
import AbstractService from './AbstractService'

type Service =
	(new (bot: Mel) => AbstractService) &
	{ [K in keyof typeof AbstractService]: typeof AbstractService[K] }

export default Service
