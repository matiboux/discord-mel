import IBaseDB from './IBaseDB'
import DBListeners from './types/DBListeners'

class AbstractDB implements IBaseDB
{
	listeners: DBListeners = new DBListeners()
}

export default AbstractDB
