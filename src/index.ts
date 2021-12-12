import Discord from 'discord.js'

import Bot from './Bot'
import AbstractCommand from './commands/AbstractCommand'
import CommandsCollection from './commands/CommandsCollection'
import DefaultConfig, { Context, Global, Guild, Guilds } from './config/DefaultConfig'
import Hook from './hooks/Hook'
import HooksManager from './hooks/HooksManager'
import AbstractState from './state/AbstractState'
import IBaseStateType from './state/IBaseStateType'
import Translator from './Translator'

const config = {
    Context,
    Global,
    Guild,
    Guilds,
}

export
{
    // Bot
    Bot,
    Discord,

    // Commands
    AbstractCommand,
    CommandsCollection,

    // Config
    DefaultConfig,
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
