import fs from 'fs'
import chalk from 'chalk'

import LogLevel from './LogLevel.js'
import ILogger from './ILogger.js'
import LoggerMessage from './LoggerMessage.js'

class Logger implements ILogger
{
	static defaultLogColors = new Map<LogLevel, (x: string) => string>([
		[LogLevel.DEBUG, chalk.bgGrey.white],
		[LogLevel.INFO, chalk.bgGreen.white],
		[LogLevel.WARN, chalk.bgHex('#FFA500').black],
		[LogLevel.ERROR, chalk.bgRed.white],
		[LogLevel.FATAL, chalk.bgRed.white],
	])

	private filePath?: string
	private stream?: fs.WriteStream

	private level: LogLevel = LogLevel.INFO
	private levelStrLength: number = 0

	private printConsole: boolean = true

	private logColors: Map<LogLevel, (x: string) => string>

	//#region Constructor

	public constructor()
	public constructor(filePath?: string)
	public constructor(filePath?: string, level?: LogLevel)
	public constructor(filePath?: string, level?: LogLevel, stdout?: boolean)
	public constructor(filePath?: string, level?: LogLevel, printConsole?: boolean)
	{
		if (filePath !== undefined)
			this.setFilePath(filePath)

		if (level !== undefined)
			this.level = level

		Object.entries(LogLevel)
			.filter(entry => isNaN(Number(entry)) && typeof entry[1] === 'number')
			.forEach(entry => this.levelStrLength = Math.max(this.levelStrLength, entry[0].length))


		if (printConsole !== undefined)
			this.printConsole = printConsole

		this.logColors = new Map(Logger.defaultLogColors.entries())
	}

	//#endregion

	//#region Logging methods

	public log(level: LogLevel, message: any, namespace?: any, error?: Error): void
	{
		if (!this.isEnabled(level))
			return

		if (message instanceof Error)
		{
			if (!error) error = message
			message = undefined
		}
		if (namespace instanceof Error)
		{
			if (!error) error = namespace
			namespace = undefined
		}

		if (error !== undefined)
		{
			if (message !== undefined)
			{
				message = `${message}\n${error.message}`
			}
			else
			{
				message = `${error.message}`
			}
		}

		const date = new Date()
		const dateStr = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
		const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
		const levelStr = LogLevel.toString(level)
		const namespaceStr = namespace !== undefined ? `[${namespace}] ` : ''
		const errorStr = error !== undefined ? `\n${error.stack}` : ''

		// const logStr = `${dateStr} ${timeStr} ${chalk.bold(LogLevel[level])} ${message}${errorStr}`
		const dateColor = chalk.bgGrey.white
		const levelColor = this.logColors.get(level) || chalk.bgGrey.white
		const messageColor = chalk.white

		// Log message in file
		const logMessage =
			(new LoggerMessage())
			.addPrefix(`${dateStr} ${timeStr} [${levelStr}] `)
			.addMessage(`${namespaceStr}${message}${errorStr}`)
			.return()
		this.stream?.write(`${logMessage}\n`)

		if (this.printConsole || !this.stream)
		{
			// Log message in console
			const consoleMessage =
				(new LoggerMessage())
				.addPrefix(' ', levelColor)
				.addPrefix(` ${dateStr} ${timeStr} `, dateColor)
				.addPrefix(` ${' '.repeat(Math.max(0, this.levelStrLength - levelStr.length))}${levelStr} `, levelColor)
				.addPrefix(' ', messageColor)
				.addMessage(`${namespaceStr}${message}${errorStr}`, messageColor)
				.return()
			this.stream?.write(`${logMessage}\n`)

			if (this.stream || level >= LogLevel.WARN)
				console.error(consoleMessage)
			else
				console.log(consoleMessage)
		}
	}

	public debug(message: any, namespace?: any, error?: Error): void
	{
		this.log(LogLevel.DEBUG, message, namespace, error)
	}

	public info(message: any, namespace?: any, error?: Error): void
	{
		this.log(LogLevel.INFO, message, namespace, error)
	}

	public warn(message: any, namespace?: any, error?: Error): void
	{
		this.log(LogLevel.WARN, message, namespace, error)
	}

	public error(message: any, namespace?: any, error?: Error): void
	{
		this.log(LogLevel.ERROR, message, namespace, error)
	}

	public fatal(message: any, namespace?: any, error?: Error): void
	{
		this.log(LogLevel.FATAL, message, namespace, error)
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
