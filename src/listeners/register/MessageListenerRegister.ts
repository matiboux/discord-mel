import ListenerTypes from '../ListenerTypes.js'
import AbstractListenerRegister from './AbstractListenerRegister.js'

class MessageListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE)
    }
}

export default MessageListenerRegister
