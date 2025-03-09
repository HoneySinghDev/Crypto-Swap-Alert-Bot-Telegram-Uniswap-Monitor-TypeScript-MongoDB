import { InlineKeyboard } from 'grammy'
import { Pairs } from '@/helpers/constant'
import { getPairById } from '@/models/Token'
import { isAddress } from 'ethers/lib/utils'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleRemoveToken(ctx: Context) {
  const TokenAddress = ctx.msg?.text?.split(' ')[1]
  if (
    !TokenAddress ||
    // TokenAddress match with array of Pairs Address or not
    Pairs.some((pair) => pair.tokenAddress === TokenAddress)
  )
    return ctx.reply('Please Send a Token address', sendOptions(ctx))

  const message = await ctx.reply(
    'I am retrieving info for this token, please wait...',
    sendOptions(ctx)
  )

  if (ctx.chat?.type !== 'supergroup') return console.log('not SuperGroup')

  if (!isAddress(TokenAddress))
    return message.editText(
      'Please Send a Valid Token address',
      sendOptions(ctx)
    )

  const TokenPairs = await getPairById(`${ctx.chat.id}`)

  if (!TokenPairs.length)
    return message.editText(
      'No Pair Found For This TokenAddress',
      sendOptions(ctx)
    )

  const pairKeyboard = new InlineKeyboard()

  pairKeyboard.text(`⚫️${TokenPairs[0].chain.chainName}⚫️`).row()

  TokenPairs.map(({ pairAddress, chain: { dexId }, token1 }) => {
    pairKeyboard
      .text(`${token1.tokenName} Pair On ${dexId}`, `d-${pairAddress}`)
      .row()
  })

  pairKeyboard.text('Done ✅', `d-done`)
  await message.delete()
  return ctx.reply(`Select pairs you are interested to remove:`, {
    ...sendOptions(ctx),
    reply_markup: pairKeyboard,
  })
}
