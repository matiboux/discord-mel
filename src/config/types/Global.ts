import assignDeep from '../../functions/assignDeep'
import Context from './Context'

class Global extends Context
{
	public mergeWith(global: Global | Context): this
	{
		assignDeep(this, global)
		return this
	}
}

export default Global
