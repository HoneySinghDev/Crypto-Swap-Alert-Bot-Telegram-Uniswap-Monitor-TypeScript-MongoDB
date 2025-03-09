import { Composer } from 'grammy'
import { guard, isAdmin, isPrivate, not, reply } from 'grammy-guard'
import Context from '@/models/Context'
import addToken from '@/handlers/commands/addToken'
import handleHelp from '@/handlers/commands/help'
import handleLanguage from '@/handlers/commands/language'
import handleRemoveToken from '@/handlers/commands/removeToken'
import handleSettings from '@/handlers/commands/settings'
import handleStart from '@/handlers/commands/start'
import handleTrending from '@/handlers/commands/trending'
import handlechangeEmoji from '@/handlers/commands/changeEmoji'
import handlechangeSupply from '@/handlers/commands/change_supply'

const CommandsHanlder = new Composer<Context>()

CommandsHanlder.command('start', handleStart)
CommandsHanlder.command('help', handleHelp)
CommandsHanlder.command('language', handleLanguage)
CommandsHanlder.command('trending', handleTrending)

CommandsHanlder.command(
  'settings',
  guard(
    [not(isPrivate), isAdmin],
    reply('Only Admins In Group Can Perform This Command')
  ),
  handleSettings
)

CommandsHanlder.command(
  'add',
  guard(
    [not(isPrivate), isAdmin],
    reply('Only Admins In Group Can Perform This Command')
  ),
  addToken
)

CommandsHanlder.command(
  'remove',
  guard(
    [not(isPrivate), isAdmin],
    reply('Only Admins In Group Can Perform This Command')
  ),
  handleRemoveToken
)

CommandsHanlder.command(
  'change_emoji',
  guard(
    [not(isPrivate), isAdmin],
    reply('Only Admins In Group Can Perform This Command')
  ),
  handlechangeEmoji
)

CommandsHanlder.command(
  'change_supply',
  guard(
    [not(isPrivate), isAdmin],
    reply('Only Admins In Group Can Perform This Command')
  ),
  handlechangeSupply
)

export default CommandsHanlder
