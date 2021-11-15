import LogLevel from './LogLevel'

interface ILogger
{
	log(level: LogLevel, message: string): void
	info(message: string): void
	warn(message: string): void
	error(message: string): void
	debug(message: string): void
	fatal(message: string): void

	getLevel(): LogLevel

	isEnabled(level: LogLevel): boolean

	isDebugEnabled(): boolean
	isInfoEnabled(): boolean
	isWarnEnabled(): boolean
	isErrorEnabled(): boolean
	isFatalEnabled(): boolean
}

export default ILogger
