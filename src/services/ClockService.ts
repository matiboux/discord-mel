import Mel from '../Mel'
import ServiceConfigType from '../config/types/ServiceConfigType'
import Service from './AbstractService'

class ClockService extends Service
{
	/**
	 * Delay between ticks in milliseconds
	 */
	public static readonly DEFAULT_TICK_DELAY: number = 30000

	public readonly TICK_DELAY: number

	public readonly TICK_DELAY_SECOND: number

	public readonly TICKS_MINUTE: number

	public readonly TICKS_HOUR: number

	protected intervalTimer?: NodeJS.Timer = undefined

	/**
	 * Ticks counter for the scheduler
	 */
	protected ticks: number = 0

	protected hoursTicks: number = 0

	protected minutesTicks: number = 0

	public constructor(name: string, config?: ServiceConfigType, bot?: Mel)
	{
		super(name, config, bot)

		this.TICK_DELAY = typeof config?.tickDelay === 'number' ? config.tickDelay : ClockService.DEFAULT_TICK_DELAY
		this.TICK_DELAY_SECOND = this.TICK_DELAY / 1000
		this.TICKS_MINUTE = 60 / this.TICK_DELAY_SECOND
		this.TICKS_HOUR = 60 * this.TICKS_MINUTE
	}

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
		this.intervalTimer = setInterval(this.tick.bind(this), this.TICK_DELAY)

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

		this.logger.debug(this.translator.translate('services.clock.tick', {
			'%ticks%': this.ticks,
			'%tickDelay%': this.TICK_DELAY,
		}), 'ClockService')

		this.bot?.hooks.execute('tick', this.ticks, this.TICK_DELAY)

		if (this.ticksFor(this.TICKS_MINUTE))
		{
			// Increment the minutes ticks counter
			++this.minutesTicks

			this.logger.debug(this.translator.translate('services.clock.tickMinute', {
				'%minutesTicks%': this.minutesTicks,
			}), 'ClockService')

			this.bot?.hooks.execute('tickMinute', this.minutesTicks)
		}

		if (this.ticksFor(this.TICKS_HOUR))
		{
			// Increment the hours ticks counter
			++this.hoursTicks

			this.logger.debug(this.translator.translate('services.clock.tickHour', {
				'%hoursTicks%': this.hoursTicks,
			}), 'ClockService')

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

		if (this.intervalTimer !== undefined)
		{
			// Stop the scheduler
			clearInterval(this.intervalTimer)
			this.intervalTimer = undefined
		}

		return this
	}
}

export default ClockService
