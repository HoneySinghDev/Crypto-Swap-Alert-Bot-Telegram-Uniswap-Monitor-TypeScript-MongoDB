import { changeEmoji } from '@/models/Token'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handlechangeEmoji(ctx: Context) {
  if (ctx.chat?.type !== 'supergroup' || !ctx.from?.id)
    return ctx.reply('This command only works in groups')

  const isAdmin = await ctx.getChatMember(ctx.from.id)

  if (!isAdmin?.status?.includes('admin'))
    return ctx.reply('You must be an admin to use this command')

  const message = ctx.msg?.text?.split(' ') || []
  const pairAddress = message[1]
  const emoji = message[2]

  if (ctx.chat?.type !== 'supergroup') return

  if (!pairAddress || !emoji)
    return ctx.reply('Please specify the pair and one emoji!', sendOptions(ctx))

  const chatId = ctx.chat.id

  const emojiChanged = await changeEmoji(chatId, pairAddress, emoji)
  if (!emojiChanged) return ctx.reply('Invalid PairAddress', sendOptions(ctx))
  return ctx.reply(
    `Emoji (${emoji}) Has Been Changed For <code>${pairAddress}</code> Pair`,
    sendOptions(ctx)
  )
}
