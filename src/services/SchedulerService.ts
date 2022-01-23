import Service from './Service'

class SchedulerService extends Service
{
	/**
	 * Delay between ticks in milliseconds
	 */
	public static readonly TICK_DELAY: number = 30000

	public static readonly TICK_DELAY_SECOND: number = SchedulerService.TICK_DELAY / 1000

	public static readonly TICKS_MINUTE: number = 60 / SchedulerService.TICK_DELAY_SECOND

	public static readonly TICKS_HOUR: number = 60 * SchedulerService.TICKS_MINUTE

	protected intervalTimer?: NodeJS.Timer = undefined

	/**
	 * Ticks counter for the scheduler
	 */
	protected ticks: number = 0

	protected hoursTicks: number = 0

	protected minutesTicks: number = 0

	/**
	 * Enable the service
	 */
	public enable(): this
	{
		if (this.bot === undefined)
		{
			throw new Error('Bot is required to enable the service')
		}

		super.enable()

		// Start the scheduler
		this.intervalTimer = setInterval(this.tick.bind(this), SchedulerService.TICK_DELAY)

		return this
	}

	protected tick(): void
	{
		if (!this.isEnabled())
		{
			return
		}

		// Increment the ticks counter
		++this.ticks

		if (this.ticksFor(SchedulerService.TICKS_MINUTE))
		{
			// Increment the minutes ticks counter
			++this.minutesTicks

			this.bot?.hooks.execute('tickMinute', this.minutesTicks)
		}

		if (this.ticksFor(SchedulerService.TICKS_HOUR))
		{
			// Increment the hours ticks counter
			++this.hoursTicks

			this.bot?.hooks.execute('tickHour', this.hoursTicks)
		}
	}

	protected ticksFor(ticksDelay: number): boolean
	{
		return this.ticks % ticksDelay < Number.EPSILON || ticksDelay < 0
	}

	/**
	 * Disable the service
	 */
	public disable(): this
	{
		super.disable()

		// Stop the scheduler
		this.intervalTimer?.unref()

		return this
	}
}

export default SchedulerService
