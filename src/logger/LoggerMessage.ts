import fs from 'fs'
import chalk from 'chalk'

type StringFunction = (x: string) => string

class LoggerMessage
{
	protected paddingLength: number = 0
	protected prefix: string = ''

	protected message: string = ''

	public addPrefix(string: any, filter?: StringFunction): this
	{
		this.paddingLength += string.length
		this.prefix += filter !== undefined ? filter(string) : string

		return this
	}

	public addMessage(string: any, filter?: StringFunction): this
	{
		this.message += filter !== undefined ? filter(string) : string

		return this
	}

	public return(): string
	{
		let msg = this.message
		if (this.paddingLength > 0)
		{
			msg = msg.replaceAll('\n', `\n${' '.repeat(this.paddingLength)}`)
		}

		return `${this.prefix}${msg}`
	}
}

export default LoggerMessage
