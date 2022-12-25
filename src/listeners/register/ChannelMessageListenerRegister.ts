import ListenerTypes from '../ListenerTypes.js'
import AbstractListenerRegister from './AbstractListenerRegister.js'

class ChannelMessageListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.CHANNEL_MESSAGE)
    }
}

export default ChannelMessageListenerRegister
