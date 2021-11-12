import fs from 'fs'

import IStateType from './IStateType'

class State
{
	stateFile?: string

	_db: IStateType = {}

	js: IStateType = {}

	accessed: boolean = false

	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		// Create the storage file if it does not exist
		if (stateFile)
		{
			if (fs.existsSync(stateFile))
			{
				this._db = JSON.parse(fs.readFileSync(stateFile, { encoding: charset }))
			}
			else
			{
				this.accessed = true
				this.save()
			}
		}
	}

	get db()
	{
		this.accessed = true
		return this._db
	}

	async setState(callback: (state: IStateType) => void)
	{
		callback(this._db)

		// Save changes
		this.accessed = true
		if (this.stateFile)
			this.save()
	}

	async save(forceSave: boolean = false)
	{
		if (!this.stateFile)
			throw new Error('State file not found')

		if (!forceSave && !this.accessed)
			return; // No changes to save

		// Save changes
		const data = JSON.stringify(this._db, null, '\t')
		fs.writeFileSync(this.stateFile, data)
		this.accessed = false
	}

	async _objectStructureFix(object: IStateType, model: IStateType): Promise<boolean>
	{
		if (typeof model !== 'object') return true
		if (typeof object !== 'object') throw false
		if (Array.isArray(model))
		{
			if (Array.isArray(object))
				return true
			else
				throw false
		}

		for (const key in model)
		{
			if (typeof model[key] !== 'object')
				continue

			if (typeof object[key] === 'undefined')
			{
				object[key] = Array.isArray(model[key]) ? [] : {}
			}
			else if (typeof object[key] !== 'object'
			         || Array.isArray(object[key]) !== Array.isArray(model[key]))
				throw false

			if (!this._objectStructureFix(object[key], model[key]))
				throw false
		}

		return true
	}

	async dbStructureFix(model: IStateType): Promise<boolean>
	{
		const result = await this._objectStructureFix(this._db, model)
		if (!result)
			throw false

		this.accessed = true
		this.save()
		return true
	}

	jsStructureFix(model: IStateType)
	{
		return this._objectStructureFix(this.js, model)
	}
}

export default State
