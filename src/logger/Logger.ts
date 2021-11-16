import fs from 'fs'

import LogLevel from './LogLevel'
import ILogger from './ILogger'

class Logger implements ILogger
{
	private filePath?: string
	private stream?: fs.WriteStream

	private level: LogLevel

	private printConsole: boolean

	//#region Constructor

	constructor()
	constructor(filePath: string)
	constructor(filePath: string, level: LogLevel)
	constructor(filePath: string, level: LogLevel, stdout: boolean)
	constructor(filePath?: string, level?: LogLevel, printConsole?: boolean)
	{
		if (filePath !== undefined)
			this.setFilePath(filePath)

		this.level = level !== undefined ? level : LogLevel.INFO

		this.printConsole = printConsole !== undefined ? printConsole : true
	}

	//#endregion

	//#region Logging methods

	public log(level: LogLevel, message: string): void
	public log(level: LogLevel, error: Error): void
	public log(level: LogLevel, message: string, error: Error): void
	public log(level: LogLevel, message: string | Error, error?: Error): void
	{
		if (!this.isEnabled(level))
			return

		if (message instanceof Error)
		{
			error = message
			message = error.message
		}

		const date = new Date()
		const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		const logMessage = `${timestamp} [${level}] ${message}${error !== undefined ? `\n${error.stack}` : ''}`

		this.stream?.write(logMessage + '\n')

		if (this.printConsole)
			console.error(logMessage)
	}

	public debug(message: string): void
	public debug(error: Error): void
	public debug(message: string, error: Error): void
	public debug(message: string | Error, error?: Error): void
	{
		if (message instanceof Error)
			this.log(LogLevel.DEBUG, message)
		else if (error instanceof Error)
			this.log(LogLevel.DEBUG, message, error)
		else
			this.log(LogLevel.DEBUG, message)
	}

	public info(message: string): void
	public info(error: Error): void
	public info(message: string, error: Error): void
	public info(message: string | Error, error?: Error): void
	{
		if (message instanceof Error)
			this.log(LogLevel.INFO, message)
		else if (error instanceof Error)
			this.log(LogLevel.INFO, message, error)
		else
			this.log(LogLevel.INFO, message)
	}

	public warn(message: string): void
	public warn(error: Error): void
	public warn(message: string, error: Error): void
	public warn(message: string | Error, error?: Error): void
	{
		if (message instanceof Error)
			this.log(LogLevel.WARN, message)
		else if (error instanceof Error)
			this.log(LogLevel.WARN, message, error)
		else
			this.log(LogLevel.WARN, message)
	}

	public error(message: string): void
	public error(error: Error): void
	public error(message: string, error: Error): void
	public error(message: string | Error, error?: Error): void
	{
		if (message instanceof Error)
			this.log(LogLevel.ERROR, message)
		else if (error instanceof Error)
			this.log(LogLevel.ERROR, message, error)
		else
			this.log(LogLevel.ERROR, message)
	}

	public fatal(message: string): void
	public fatal(error: Error): void
	public fatal(message: string, error: Error): void
	public fatal(message: string | Error, error?: Error): void
	{
		if (message instanceof Error)
			this.log(LogLevel.FATAL, message)
		else if (error instanceof Error)
			this.log(LogLevel.FATAL, message, error)
		else
			this.log(LogLevel.FATAL, message)
	}

	//#endregion

	//#region Configuration methods

	public setFilePath(filePath: string): void
	{
		this.filePath = filePath
		this.stream = fs.createWriteStream(this.filePath, { flags: 'a' })
	}

	public setLevel(level: LogLevel): void
	{
		this.level = level
	}

	public setStdout(stdout: boolean): void
	{
		this.printConsole = stdout
	}

	//#endregion

	//#region Log level methods

	public getLevel(): LogLevel
	{
		return this.level
	}

	public isEnabled(level: LogLevel): boolean
	{
		return level >= this.level
	}

	public isDebugEnabled(): boolean
	{
		return this.isEnabled(LogLevel.DEBUG)
	}

	public isInfoEnabled(): boolean
	{
		return this.isEnabled(LogLevel.INFO)
	}

	public isWarnEnabled(): boolean
	{
		return this.isEnabled(LogLevel.WARN)
	}

	public isErrorEnabled(): boolean
	{
		return this.isEnabled(LogLevel.ERROR)
	}

	public isFatalEnabled(): boolean
	{
		return this.isEnabled(LogLevel.FATAL)
	}

	//#endregion
}

export default Logger
