import Discord from 'discord.js'
import DiscordAPITypes from 'discord-api-types/v9'

import AbstractCommand from './commands/AbstractCommand.js'
import CommandsCollection from './commands/CommandsCollection.js'
import AbstractConfig, { AbstractContext, Global, Guild, Guilds } from './config/AbstractConfig.js'
import AbstractConfigType from './config/types/AbstractConfigType.js'
import ISerialize from './functions/ISerialize.js'
import IUnserialize from './functions/IUnserialize.js'
import serialize from './functions/serialize.js'
import unserialize from './functions/unserialize.js'
import Hook from './hooks/Hook.js'
import HooksManager from './hooks/HooksManager.js'
import AbstractListener from './listeners/AbstractListener.js'
import ChannelComponentListener from './listeners/ChannelComponentListener.js'
import ChannelMessageListener from './listeners/ChannelMessageListener.js'
import AbstractHandler from './listeners/handler/AbstractHandler.js'
import ChannelComponentHandler from './listeners/handler/ChannelComponentHandler.js'
import ChannelMessageHandler from './listeners/handler/ChannelMessageHandler.js'
import MessageComponentHandler from './listeners/handler/MessageComponentHandler.js'
import MessageHandler from './listeners/handler/MessageHandler.js'
import MessageReactionHandler from './listeners/handler/MessageReactionHandler.js'
import ListenerTypes from './listeners/ListenerTypes.js'
import MessageComponentListener from './listeners/MessageComponentListener.js'
import MessageListener from './listeners/MessageListener.js'
import MessageReactionListener from './listeners/MessageReactionListener.js'
import AbstractListenerRegister from './listeners/register/AbstractListenerRegister.js'
import ChannelComponentListenerRegister from './listeners/register/ChannelComponentListenerRegister.js'
import ChannelMessageListenerRegister from './listeners/register/ChannelMessageListenerRegister.js'
import MessageComponentListenerRegister from './listeners/register/MessageComponentListenerRegister.js'
import MessageListenerRegister from './listeners/register/MessageListenerRegister.js'
import MessageReactionListenerRegister from './listeners/register/MessageReactionListenerRegister.js'
import Mel from './Mel.js'
import AbstractState from './state/AbstractState.js'
import AbstractDB from './state/db/AbstractDB.js'
import IBaseDB from './state/db/IBaseDB.js'
import AbstractDBMapType from './state/db/types/AbstractDBMapType.js'
import AbstractDBType from './state/db/types/AbstractDBType.js'
import DBListener from './state/db/types/DBListener.js'
import DBListeners from './state/db/types/DBListeners.js'
import Translator from './Translator.js'

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
    DiscordAPITypes,
    Mel,

    // Commands
    AbstractCommand,
    CommandsCollection,

    // Config
    AbstractConfig,
    AbstractConfigType,
    config,

    // Serialization
    ISerialize,
    IUnserialize,
    serialize,
    unserialize,

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
