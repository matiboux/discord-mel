import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class ChannelMessageListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.CHANNEL_MESSAGE)
    }
}

export default ChannelMessageListenerRegister
