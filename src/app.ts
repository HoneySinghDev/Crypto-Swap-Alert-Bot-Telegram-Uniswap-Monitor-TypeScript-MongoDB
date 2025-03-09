import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { development, production } from '@/helpers/launch'
import { hydrate } from '@grammyjs/hydrate'
import { limit } from '@grammyjs/ratelimiter'
import { sequentialize } from 'grammy-middlewares'
import { session } from '@/helpers/session'
import ActionHandler from '@/handlers/actions'
import CommandsHanlder from '@/handlers/commands'
import attachUser, { attachTokenData } from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import changeRouter from '@/conversations/change'
import checkTrade from '@/helpers/checkTrade'
import configureI18n from '@/middlewares/configureI18n'
import env from '@/helpers/env'
import eventHandler from '@/handlers/events'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import settingMenu, { tokenPreferenceMenu } from '@/menus/keyboard'
import startMongo from '@/helpers/startMongo'
async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    // .use(ignoreOld())
    .use(attachUser, attachTokenData)
    .use(limit())
    .use(hydrate())
    .use(i18n.middleware())
    .use(configureI18n)
    //Sessions
    .use(session)
    // Menus
    .use(languageMenu)
    //Menus
    .use(settingMenu)
    //Routers
    .use(changeRouter)
    // Commands
    .use(CommandsHanlder)
    //Action (CallBackQuery) Handler
    .use(ActionHandler)
    //Events Handler
    .use(eventHandler)

  await (env.isDev ? development(bot) : production(bot))
  await checkTrade()
}
void runApp()
