import {
  findAllTokenPairsByPairAddress,
  increasePairCount,
  removePairByPairAddress,
  removeTokenPairById,
} from '@/models/Token'
import Context from '@/models/Context'
import SwapListner from '@/helpers/tradeListner'

async function removePair(ctx: Context) {
  const callbackQueryData = ctx.callbackQuery?.data?.split('-') || []
  const pairAddress = callbackQueryData[1]

  if (pairAddress === 'done') return ctx.deleteMessage()

  if (ctx.chat?.type !== 'supergroup') return
  const removedToken = await removeTokenPairById(ctx.chat.id, pairAddress)
  if (!removedToken)
    return ctx.answerCallbackQuery(
      'Invalid Pair Try With Different Token Address'
    )
  else {
    const otherPairExits = await findAllTokenPairsByPairAddress(pairAddress)

    if (otherPairExits.length === 0) {
      await removePairByPairAddress(pairAddress)
      SwapListner.stopListner(pairAddress)
    }
    await increasePairCount(pairAddress, -1)
    return ctx.answerCallbackQuery({
      text: `Pair Has Been Removed`,
      show_alert: true,
    })
  }
}

export default removePair
