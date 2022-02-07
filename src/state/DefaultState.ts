import AbstractState from './AbstractState'
import DefaultDB from './db/DefaultDB'

class DefaultState extends AbstractState<DefaultDB>
{
	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		super(stateFile, charset)
	}

	protected initProperties(): void
	{
		this._db = new DefaultDB()
	}
}

export default DefaultState
