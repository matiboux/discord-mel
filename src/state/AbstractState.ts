import fs from 'fs'
import path from 'path'

import assignDeep from '../functions/assignDeep'
import IBaseStateType from './IBaseStateType'

abstract class AbstractState<DBType extends IBaseStateType, JSType extends IBaseStateType>
{
	public static readonly assignDeep = assignDeep

	protected stateFile?: string

	protected _db: DBType

	public js: JSType

	protected accessed: boolean = false

	public constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		// Default properties initialization
		this._db = {} as DBType
		this.js = {} as JSType

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
				const db = JSON.parse(fs.readFileSync(stateFile, { encoding: charset }))
				assignDeep(this._db, db)
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
		// Override this method to initialize properties
		throw new Error(`Method 'initProperties' is not implemented`)
	}

	public get db(): DBType
	{
		this.accessed = true
		return this._db
	}

	public async setState(callback: (state: DBType) => void): Promise<void>
	{
		callback(this._db)

		// Save changes
		this.accessed = true
		if (this.stateFile)
			this.save()
	}

	public async save(forceSave: boolean = false): Promise<void>
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

	public async saveBackup(db: DBType = this._db): Promise<void>
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
