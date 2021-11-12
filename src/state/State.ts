import fs from 'fs'

import IState from './IState'

class State
{
	stateFile?: string

	_db: IState

	js: IState = {}

	accessed: boolean = false

	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		this._db = {}

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

	async setState(callback: (state: IState) => void)
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

	async _objectStructureFix(object: IState, model: IState)
	{
		if (typeof model !== 'object') return true
		if (typeof object !== 'object') return false
		if (Array.isArray(model)) return Array.isArray(object)

		for (let key in model)
		{
			if (typeof model[key] !== 'object')
				continue

			if (typeof object[key] === 'undefined')
			{
				if (Array.isArray(model[key])) object[key] = []
				else object[key] = {}
			}
			else if (typeof object[key] !== 'object'
						|| Array.isArray(object[key]) !== Array.isArray(model[key]))
				return false

			if (!this._objectStructureFix(object[key], model[key]))
				return false
		}

		return true
	}

	async dbStructureFix(model: IState): Promise<boolean>
	{
		const fixed = await this._objectStructureFix(this._db, model)
		if (fixed)
		{
			this.accessed = true
			this.save()
			return true
		}

		return false
	}

	async jsStructureFix(model: IState)
	{
		return this._objectStructureFix(this.js, model)
	}
}

export default State
