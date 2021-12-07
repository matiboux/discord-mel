import fs from 'fs'
import path from 'path'

import IBaseStateType from './IBaseStateType'

abstract class AbstractState<T extends IBaseStateType, U extends IBaseStateType>
{
	stateFile?: string

	_db: T

	js: U

	accessed: boolean = false

	constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		// Illegal default properties initialization
		this._db = undefined as any
		this.js = undefined as any

		// Initialize properties
		this.initProperties()

		// Check for properties being initialized
		if (!this._db)
			throw new Error('State database object is not defined');
		if (!this.js)
			throw new Error('State javascript object is not defined');

		// Create the storage file if it does not exist
		if (stateFile)
		{
			if (fs.existsSync(stateFile))
			{
				AbstractState.assignDeep(this._db, JSON.parse(fs.readFileSync(stateFile, { encoding: charset })))
				this.saveBackup(this._db)
			}
			else
			{
				this.accessed = true
				this.save()
			}
		}
	}

	protected initProperties(): void
	{
		this._db = {} as T
		this.js = {} as U
	}

	get db(): T
	{
		this.accessed = true
		return this._db
	}

	async setState(callback: (state: T) => void): Promise<void>
	{
		callback(this._db)

		// Save changes
		this.accessed = true
		if (this.stateFile)
			this.save()
	}

	async save(forceSave: boolean = false): Promise<void>
	{
		if (!this.stateFile)
			throw new Error('State file not found')

		if (!forceSave && !this.accessed)
			return; // No changes to save

		const data = JSON.stringify(this._db, null, '\t')

		// Save changes
		fs.writeFileSync(this.stateFile, data)
		this.accessed = false
	}

	async saveBackup(db: T = this._db): Promise<void>
	{
		if (!this.stateFile)
			throw new Error('State file not found')

		const stateBasename = path.basename(this.stateFile)
		const stateBackupFile = this.stateFile + '.bak'
		const stateBackupBasename = stateBasename + '.bak'
		let backupExists = false
		let lastBackupNumber = 0
		fs.readdirSync(path.dirname(this.stateFile))
			.forEach(file =>
				{
					if (file === stateBackupBasename)
					{
						backupExists = true
					}
					else if (file.startsWith(stateBasename + '.bak.'))
					{
						const backupNumber = parseInt(file.replace(/^.*\.bak\./, ''))
						if (backupNumber > lastBackupNumber)
							lastBackupNumber = backupNumber
					}
				})
		if (backupExists)
		{
			fs.renameSync(stateBackupFile, stateBackupFile + '.' + (lastBackupNumber + 1))
		}

		// Save backup
		const data = JSON.stringify(db, null, '\t')
		fs.writeFileSync(stateBackupFile, data)
	}

	public static assignDeep(target: any, ...sources: any[]): any
	{
		if (sources.length <= 0)
			return target

		target = Object(target)
		const source = sources.shift()

		if (typeof source === 'object')
		{
			for (const key in source)
			{
				if (typeof source[key] === 'object')
				{
					target[key] = target[key] !== undefined ? Object(target[key]) : {}
					this.assignDeep(target[key], source[key])
				}
				else
				{
					Object.assign(target, { [key]: source[key] })
				}
			}
		}

		return this.assignDeep(target, ...sources)
	}

	async _objectStructureFix(object: IBaseStateType, model: IBaseStateType): Promise<boolean>
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

	async dbStructureFix(model: IBaseStateType): Promise<boolean>
	{
		const result = await this._objectStructureFix(this._db, model)
		if (!result)
			throw false

		this.accessed = true
		this.save()
		return true
	}

	async jsStructureFix(model: IBaseStateType): Promise<boolean>
	{
		return this._objectStructureFix(this.js, model)
	}
}

export default AbstractState
