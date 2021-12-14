import Discord from 'discord.js'

import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import AbstractConfig, { AbstractContext, Global, Guild, Guilds } from './config/AbstractConfig'
import Hook from './hooks/Hook'
import HooksManager from './hooks/HooksManager'
import Mel from './Mel'
import AbstractState from './state/AbstractState'
import IBaseStateType from './state/IBaseStateType'
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
    config,

    // Hooks
    Hook,
    HooksManager,

    // State
    AbstractState,
    IBaseStateType,

    // Translator
    Translator,
}
