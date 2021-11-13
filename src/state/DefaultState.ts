import fs from 'fs'

import AbstractState from './AbstractState'
import BaseStateType from './BaseStateType'

class DefaultState extends AbstractState<BaseStateType, BaseStateType>
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
