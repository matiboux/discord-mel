import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class MessageComponentListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE_COMPONENT)
    }
}

export default MessageComponentListenerRegister
