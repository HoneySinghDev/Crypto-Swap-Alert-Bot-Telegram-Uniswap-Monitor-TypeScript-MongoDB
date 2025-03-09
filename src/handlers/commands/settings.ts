import { getPairById } from '@/models/Token'
import Context from '@/models/Context'
import bot from '@/helpers/bot'
import settingMenu from '@/menus/keyboard'

export default async function handleSettings(ctx: Context) {
  const pair = await getPairById(`${ctx.chat?.id}`)
  if (pair.length === 0) {
    return ctx.reply('Please Add Token First')
  }
  const message =
    `⚙️ ${bot.botInfo.first_name} ${bot.botInfo.last_name || ''}\n\n` +
    `${bot.botInfo.first_name} with Top Trending @${bot.botInfo.username} and Dex Trade Alerts. `

  return ctx.reply(message, { reply_markup: settingMenu })
}
