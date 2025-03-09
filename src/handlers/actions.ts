import { Composer } from 'grammy'
import { guard, isAdmin, isPrivate, not } from 'grammy-guard'
import Context from '@/models/Context'
import addPair from '@/handlers/actions/addPair'
import removePair from '@/handlers/actions/removePair'

const ActionHandler = new Composer<Context>()

//Add Button Handler
ActionHandler.callbackQuery(
  /a-(.*?)/,
  guard([not(isPrivate), isAdmin], (ctx: Context) => {
    return ctx.answerCallbackQuery({
      text: 'Only Group Admin Can Use The Bot',
      show_alert: true,
    })
  }),
  addPair
)

//Delete Button Handler
ActionHandler.callbackQuery(
  /d-(.*?)/,
  guard([not(isPrivate), isAdmin], (ctx: Context) => {
    return ctx.answerCallbackQuery({
      text: 'Only Group Admin Can Use The Bot',
      show_alert: true,
    })
  }),
  removePair
)

export default ActionHandler
