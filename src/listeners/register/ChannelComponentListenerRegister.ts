import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class ChannelComponentListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.CHANNEL_COMPONENT)
    }
}

export default ChannelComponentListenerRegister
