import Listeners from './types/Listeners'

interface IBaseDB
{
	[x: string]: any

	listeners: Listeners
}

export default IBaseDB