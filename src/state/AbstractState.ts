import fs from 'fs'
import path from 'path'

import unserialize from '../functions/unserialize'
import IBaseDB from './db/IBaseDB'

abstract class AbstractState<DBType extends IBaseDB>
{
	public static readonly unserialize = unserialize

	protected stateFile?: string

	protected _db: DBType

	protected accessed: boolean = false

	public constructor(stateFile?: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		// Default properties initialization
		this._db = {} as DBType

		// Initialize properties
		this.initProperties()

		// Check for properties being initialized
		if (!this._db)
			throw new Error('State database object is not defined');

		// Create the storage file if it does not exist
		if (stateFile)
		{
			if (fs.existsSync(stateFile))
			{
				const db = JSON.parse(fs.readFileSync(stateFile, { encoding: charset }))
				unserialize(this._db, db)
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
}

export default AbstractState
