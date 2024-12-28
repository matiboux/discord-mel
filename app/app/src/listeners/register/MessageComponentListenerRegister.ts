import ListenerTypes from '../ListenerTypes.js'
import AbstractListenerRegister from './AbstractListenerRegister.js'

class MessageComponentListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE_COMPONENT)
    }
}

export default MessageComponentListenerRegister
