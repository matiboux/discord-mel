import IBaseDB from './IBaseDB.js'
import DBListeners from './types/DBListeners.js'

class AbstractDB implements IBaseDB
{
	public listeners: DBListeners = new DBListeners()
}

export default AbstractDB
