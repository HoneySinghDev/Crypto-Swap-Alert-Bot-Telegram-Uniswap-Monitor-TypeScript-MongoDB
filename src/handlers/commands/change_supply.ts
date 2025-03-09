import { changeTotalSupply } from '@/models/Token'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

function isWholeNumber(value: any) {
  if (value % 1 === 0) {
    return true
  } else {
    return false
  }
}

export default async function handlechangeSupply(ctx: Context) {
  if (ctx.chat?.type !== 'supergroup' || !ctx.from?.id)
    return ctx.reply('This command only works in groups')

  const isAdmin = await ctx.getChatMember(ctx.from.id)

  if (!isAdmin?.status?.includes('admin'))
    return ctx.reply('You must be an admin to use this command')

  const message = ctx.msg?.text?.split(' ') || []
  const pairAddress = message[1]
  const supplyAmount = message[2]

  if (ctx.chat?.type !== 'supergroup') return

  if (!pairAddress || !supplyAmount)
    return ctx.reply(
      'Please specify the pair and Supply Amount!',
      sendOptions(ctx)
    )

  if (!isWholeNumber(`${supplyAmount}`))
    return ctx.reply(
      'Enter Valid Amount To Change - Whole Number Without Commas'
    )

  const chatId = ctx.chat.id

  const emojiChanged = await changeTotalSupply(
    chatId,
    pairAddress,
    Number(supplyAmount)
  )
  if (!emojiChanged) return ctx.reply('Invalid PairAddress', sendOptions(ctx))

  return ctx.reply(
    `SupplyAmount (<code>${supplyAmount}</code>) Has Been Changed For <code>${pairAddress}</code> Pair`,
    sendOptions(ctx)
  )
}
