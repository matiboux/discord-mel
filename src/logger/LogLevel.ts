enum LogLevel
{
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	FATAL = 4,
}

namespace LogLevel
{
    export function toString(mode: LogLevel): string
	{
        return LogLevel[mode]
    }
}

export default LogLevel