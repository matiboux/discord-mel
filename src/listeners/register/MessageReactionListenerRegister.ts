import ListenerTypes from '../ListenerTypes.js'
import AbstractListenerRegister from './AbstractListenerRegister.js'

class MessageReactionListenerRegister extends AbstractListenerRegister
{
    public constructor()
    {
        super(ListenerTypes.MESSAGE_REACTION)
    }
}

export default MessageReactionListenerRegister
