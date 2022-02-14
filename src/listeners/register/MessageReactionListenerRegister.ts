import ListenerTypes from '../ListenerTypes'
import AbstractListenerRegister from './AbstractListenerRegister'

class MessageReactionListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE_REACTION)
    }
}

export default MessageReactionListenerRegister
