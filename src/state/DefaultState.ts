import AbstractState from './AbstractState'
import DefaultStateType from './DefaultStateType'

class DefaultState extends AbstractState<DefaultStateType>
{
	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		super(stateFile, charset)
	}

	protected initProperties(): void
	{
		this._db = new DefaultStateType()
	}
}

export default DefaultState
