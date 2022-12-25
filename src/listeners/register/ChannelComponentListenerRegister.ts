import ListenerTypes from '../ListenerTypes.js'
import AbstractListenerRegister from './AbstractListenerRegister.js'

class ChannelComponentListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.CHANNEL_COMPONENT)
    }
}

export default ChannelComponentListenerRegister
