import Discord from 'discord.js'

import AbstractHandler from './AbstractHandler'
import ChannelMessageHandlerOptions from './ChannelMessageHandlerOptions'
import ChannelMessageHandlerEvents from './ChannelMessageHandlerEvents'
import ChannelMessageListener from '../ChannelMessageListener'

type FilterFunction = (listener: ChannelMessageListener, message: Discord.Message) => boolean | Promise<boolean>

type StoreFilterFunction = (listener: ChannelMessageListener, message: Discord.Message) => boolean

class ChannelMessageHandler extends AbstractHandler
{
	public filter?: FilterFunction

	public storefilter?: StoreFilterFunction

	public readonly options: ChannelMessageHandlerOptions = new ChannelMessageHandlerOptions()

	public readonly on: ChannelMessageHandlerEvents = new ChannelMessageHandlerEvents()

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

	public configureOptions(optionsFunction: (options: ChannelMessageHandlerOptions) => void): this
	{
		optionsFunction(this.options)
		return this
	}

	public configureOn(onFunction: (on: ChannelMessageHandlerEvents) => void): this
	{
		onFunction(this.on)
		return this
	}
}

export default ChannelMessageHandler
