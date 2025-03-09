/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Bot, webhookCallback } from 'grammy'
import { run } from '@grammyjs/runner'
import Context from '@/models/Context'
import _SwapListner from '@/helpers/tradeListner'
import env from '@/helpers/env'
import errorHanlder from '@/helpers/errorHanlder'
import express, { Request, Response } from 'express'
import path from 'path'

const production = async (bot: Bot<Context>) => {
  try {
    await bot.init()
    const app = express() // or whatever you're using
    app.use(express.json()) // parse the JSON request body
    app.use(webhookCallback(bot, 'express'))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.use((err: any, req: Request, res: Response) => {
      console.error('Unknown error:', err)
      return res.status(200).send()
    })

    app.listen(80, async () => {
      await bot.api.setWebhook(`${env.RAILWAY_STATIC_URL}`, {
        drop_pending_updates: true,
      })
      console.log(`Webhook Server Start At - 80`)
    })
    console.info(`Bot ${bot.botInfo.username} is up and running`)
  } catch (e) {
    console.error(e)
  }
}

const development = async (bot: Bot<Context>): Promise<void> => {
  try {
    // await bot.api.deleteWebhook()

    // Errors
    bot.catch(errorHanlder)

    // Start bot
    await bot.init()
    const runner = run(bot)
    console.info(`Bot ${bot.botInfo.username} is up and running`)

    //Stop The Bot When Process Stops
    const stopRunner = () => {
      console.log('\n\nStopping Bot And Removing Listeners\n\n')

      _SwapListner.stopAllListners()
      runner.isRunning() && runner.stop()
    }
    process.once('SIGINT', stopRunner)
    process.once('SIGTERM', stopRunner)
  } catch (e) {
    console.error(e)
  }
}

export { production, development }
