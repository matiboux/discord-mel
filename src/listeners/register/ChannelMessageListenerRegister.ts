import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class MessageComponentListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.CHANNEL_MESSAGE)
    }
}

export default MessageComponentListenerRegister
