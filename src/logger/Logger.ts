import fs from 'fs'
import chalk from 'chalk'

import LogLevel from './LogLevel'
import ILogger from './ILogger'

class Logger implements ILogger
{
	static defaultLogColors = new Map<LogLevel, (x: string) => string>([
		[LogLevel.DEBUG, chalk.bgGrey.white],
		[LogLevel.INFO, chalk.bgGreen.white],
		[LogLevel.WARN, chalk.bgHex('#FFA500').black],
		[LogLevel.ERROR, chalk.bgRed.white],
		[LogLevel.FATAL, chalk.black.white],
	])

	private filePath?: string
	private stream?: fs.WriteStream

	private level: LogLevel
	private levelStrLength: number = 0

	private printConsole: boolean

	private logColors: Map<LogLevel, (x: string) => string>

	//#region Constructor

	constructor()
	constructor(filePath?: string)
	constructor(filePath?: string, level?: LogLevel)
	constructor(filePath?: string, level?: LogLevel, stdout?: boolean)
	constructor(filePath?: string, level?: LogLevel, printConsole?: boolean)
	{
		if (filePath !== undefined)
			this.setFilePath(filePath)

		this.level = level !== undefined ? level : LogLevel.INFO
		Object.entries(LogLevel)
			.filter(entry => isNaN(Number(entry)) && typeof entry[1] === 'number')
			.forEach(entry => this.levelStrLength = Math.max(this.levelStrLength, entry[0].length))

		this.printConsole = printConsole !== undefined ? printConsole : true

		this.logColors = new Map(Logger.defaultLogColors.entries())
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
		const dateStr = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
		const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
		const levelStr = LogLevel.toString(level)
		const errorStr = error !== undefined ? `\n${error.stack}` : ''

		// const logStr = `${dateStr} ${timeStr} ${chalk.bold(LogLevel[level])} ${message}${errorStr}`
		const dateColor = chalk.bgBlue.white
		const levelColor = this.logColors.get(level) || chalk.bgGrey.white
		const messageColor = chalk.white

		const consoleMessage = levelColor(' ') + dateColor(` ${dateStr} ${timeStr} `)
			+ levelColor(` ${' '.repeat(Math.max(0, this.levelStrLength - levelStr.length))}${levelStr} `)
			+ messageColor(` ${message}${errorStr}`)
		const logMessage = `${dateStr} ${timeStr} [${levelStr}] ${message}${errorStr}`

		this.stream?.write(logMessage + '\n')

		if (this.printConsole)
		{
			if (this.stream || level >= LogLevel.WARN)
				console.error(consoleMessage)
			else
				console.log(consoleMessage)
		}
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
		const fileExists = fs.existsSync(this.filePath)
		this.stream = fs.createWriteStream(this.filePath, { flags: 'a' })
		if (fileExists) this.stream.write('\n')
	}

	public setLevel(level: LogLevel | string): void
	{
		if (typeof level === 'string')
			level = LogLevel.fromString(level)

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
