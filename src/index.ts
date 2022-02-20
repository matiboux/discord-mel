import Discord from 'discord.js'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import AbstractConfig, { AbstractContext, Global, Guild, Guilds } from './config/AbstractConfig'
import AbstractConfigType from './config/types/AbstractConfigType'
import Hook from './hooks/Hook'
import HooksManager from './hooks/HooksManager'
import AbstractListener from './listeners/AbstractListener'
import AbstractHandler from './listeners/handler/AbstractHandler'
import MessageHandler from './listeners/handler/MessageHandler'
import MessageReactionHandler from './listeners/handler/MessageReactionHandler'
import ListenerTypes from './listeners/ListenerTypes'
import MessageListener from './listeners/MessageListener'
import MessageReactionListener from './listeners/MessageReactionListener'
import AbstractListenerRegister from './listeners/register/AbstractListenerRegister'
import MessageListenerRegister from './listeners/register/MessageListenerRegister'
import MessageReactionListenerRegister from './listeners/register/MessageReactionListenerRegister'
import Mel from './Mel'
import AbstractState from './state/AbstractState'
import AbstractDB from './state/db/AbstractDB'
import IBaseDB from './state/db/IBaseDB'
import Translator from './Translator'

const config = {
    AbstractContext,
    Global,
    Guild,
    Guilds,
}

export
{
    // Bot
    Discord,
    Mel,

    // Commands
    AbstractCommand,
    CommandsCollection,

    // Config
    AbstractConfig,
    AbstractConfigType,
    config,

    // State
    AbstractState,
    IBaseDB,
    AbstractDB,

    // Hooks
    Hook,
    HooksManager,

    // Listeners
    AbstractListener,
    ListenerTypes,
    MessageListener,
    MessageReactionListener,

    // Listener Handlers
    AbstractHandler,
    MessageHandler,
    MessageReactionHandler,

    // Listener Registers
    AbstractListenerRegister,
    MessageListenerRegister,
    MessageReactionListenerRegister,

    // Translator
    Translator,
}
