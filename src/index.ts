import Discord from 'discord.js'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import AbstractConfig, { AbstractContext, Global, Guild, Guilds } from './config/AbstractConfig'
import AbstractConfigType from './config/types/AbstractConfigType'
import Hook from './hooks/Hook'
import HooksManager from './hooks/HooksManager'
import Mel from './Mel'
import AbstractState from './state/AbstractState'
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

    // Hooks
    Hook,
    HooksManager,

    // State
    AbstractState,
    IBaseDB,

    // Translator
    Translator,
}
