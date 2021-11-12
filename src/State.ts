import fs from 'fs'

class State
{
	stateFile: string

	_db: object

	js: object = {}

	accessed: boolean = false

	constructor(stateFile: string, charset: BufferEncoding = 'utf8')
	{
		this.stateFile = stateFile

		// Create the storage file if it does not exist
		if (fs.existsSync(stateFile))
		{
			this._db = JSON.parse(fs.readFileSync(stateFile, { encoding: charset }))
		}
		else
		{
			this._db = {}
			this.save()
		}
	}

	get db() {
		this.accessed = true;
		return this._db;
	}

	async setState(callback: (state: object) => void)
	{
		callback(this._db)

		// Save changes
		this.accessed = true
		this.save()
	}

	async save()
	{
		if (!this.accessed)
			return; // No changes to save

		// Save changes
		const data = JSON.stringify(this._db, null, '\t')
		fs.writeFileSync(this.stateFile, data)
	}
}

export default State
