import Discord from 'discord.js'

import MessageComponentListener from '../ChannelComponentListener.js'
import AbstractHandler from './AbstractHandler.js'
import ChannelComponentHandlerEvents from './ChannelComponentHandlerEvents.js'
import ChannelComponentHandlerOptions from './ChannelComponentHandlerOptions.js'

type FilterFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => boolean | Promise<boolean>

type StoreFilterFunction = (listener: MessageComponentListener, interaction: Discord.MessageComponentInteraction) => boolean

class ChannelComponentHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public storefilter?: StoreFilterFunction

	public readonly options: ChannelComponentHandlerOptions = new ChannelComponentHandlerOptions()

	public readonly on: ChannelComponentHandlerEvents = new ChannelComponentHandlerEvents()

	public setFilter(filterFunction?: FilterFunction): this
	{
		this.filter = filterFunction
		return this
	}

	public setStoreFilter(storefilterFunction?: StoreFilterFunction): this
	{
		this.storefilter = storefilterFunction
		return this
	}

	public configureOptions(optionsFunction: (options: ChannelComponentHandlerOptions) => void): this
	{
		optionsFunction(this.options)
		return this
	}

	public configureOn(onFunction: (on: ChannelComponentHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default ChannelComponentHandler
