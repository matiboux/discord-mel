import DBListeners from './types/DBListeners'

interface IBaseDB
{
	[x: string]: any

	listeners: DBListeners
}

export default IBaseDB