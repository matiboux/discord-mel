import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class MessageListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE)
    }
}

export default MessageListenerRegister
