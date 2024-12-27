import DBListeners from './types/DBListeners.js'

interface IBaseDB
{
	[x: string]: any

	listeners: DBListeners
}

export default IBaseDB