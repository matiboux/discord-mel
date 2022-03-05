import Discord from 'discord.js'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import AbstractConfig, { AbstractContext, Global, Guild, Guilds } from './config/AbstractConfig'
import AbstractConfigType from './config/types/AbstractConfigType'
import Hook from './hooks/Hook'
import HooksManager from './hooks/HooksManager'
import AbstractListener from './listeners/AbstractListener'
import ChannelComponentListener from './listeners/ChannelComponentListener'
import ChannelMessageListener from './listeners/ChannelMessageListener'
import AbstractHandler from './listeners/handler/AbstractHandler'
import ChannelComponentHandler from './listeners/handler/ChannelComponentHandler'
import ChannelMessageHandler from './listeners/handler/ChannelMessageHandler'
import MessageComponentHandler from './listeners/handler/MessageComponentHandler'
import MessageHandler from './listeners/handler/MessageHandler'
import MessageReactionHandler from './listeners/handler/MessageReactionHandler'
import ListenerTypes from './listeners/ListenerTypes'
import MessageComponentListener from './listeners/MessageComponentListener'
import MessageListener from './listeners/MessageListener'
import MessageReactionListener from './listeners/MessageReactionListener'
import AbstractListenerRegister from './listeners/register/AbstractListenerRegister'
import ChannelComponentListenerRegister from './listeners/register/ChannelComponentListenerRegister'
import ChannelMessageListenerRegister from './listeners/register/ChannelMessageListenerRegister'
import MessageComponentListenerRegister from './listeners/register/MessageComponentListenerRegister'
import MessageListenerRegister from './listeners/register/MessageListenerRegister'
import MessageReactionListenerRegister from './listeners/register/MessageReactionListenerRegister'
import Mel from './Mel'
import AbstractState from './state/AbstractState'
import AbstractDB from './state/db/AbstractDB'
import IBaseDB from './state/db/IBaseDB'
import AbstractDBMapType from './state/db/types/AbstractDBMapType'
import AbstractDBType from './state/db/types/AbstractDBType'
import DBListener from './state/db/types/DBListener'
import DBListeners from './state/db/types/DBListeners'
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

    // State types
    AbstractDBMapType,
    AbstractDBType,
    DBListener,
    DBListeners,

    // Hooks
    Hook,
    HooksManager,

    // Listeners
    AbstractListener,
    ListenerTypes,
    ChannelComponentListener,
    ChannelMessageListener,
    MessageComponentListener,
    MessageListener,
    MessageReactionListener,

    // Listener Handlers
    AbstractHandler,
    ChannelComponentHandler,
    ChannelMessageHandler,
    MessageComponentHandler,
    MessageHandler,
    MessageReactionHandler,

    // Listener Registers
    AbstractListenerRegister,
    ChannelComponentListenerRegister,
    ChannelMessageListenerRegister,
    MessageComponentListenerRegister,
    MessageListenerRegister,
    MessageReactionListenerRegister,

    // Translator
    Translator,
}
