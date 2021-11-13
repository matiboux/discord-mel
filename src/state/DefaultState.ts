import fs from 'fs'

import BaseState from './BaseState'
import BaseStateType from './BaseStateType'

class DefaultState extends BaseState<BaseStateType, BaseStateType>
{
	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		super(stateFile, charset)
	}

	protected initProperties(): void
	{
		this._db = new BaseStateType()
		this.js = new BaseStateType()
	}
}

export default DefaultState
