import AbstractState from './AbstractState.js'
import DefaultDB from './db/DefaultDB.js'

class DefaultState extends AbstractState<DefaultDB>
{
	public constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		super(stateFile, charset)
	}

	protected initProperties(): void
	{
		this._db = new DefaultDB()
	}
}

export default DefaultState
