import IBaseDB from './IBaseDB'
import Listeners from './types/Listeners'

class AbstractDB implements IBaseDB
{
	listeners: Listeners = new Listeners()
}

export default AbstractDB
