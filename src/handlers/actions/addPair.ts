import { Pairs } from '@/helpers/constant'
import {
  addToken,
  checkPairExist,
  createPair,
  getPairById,
  increasePairCount,
  pairExitsWithChatId,
} from '@/models/Token'
import Context from '@/models/Context'
import SwapListner from '@/helpers/tradeListner'

async function addPair(ctx: Context) {
  const callbackQueryData = ctx.callbackQuery?.data?.split('-') || []
  const dex = callbackQueryData[1]
  const pairAddress = callbackQueryData[2]
  const token1Id = Number(callbackQueryData[3])
  const pairSwitched = callbackQueryData[4] !== '0'
  const id = `${ctx.chat?.id}`

  if (
    (dex === 'done' && pairAddress === 'done') ||
    !ctx.session.tokenData.chainId
  )
    return ctx.deleteMessage()

  const { tokenName, tokenSymbol, tokenDecimals, tokenSupply, tokenAddress } =
    ctx.session.tokenData

  const token1 = Pairs.find((item) => item.id === token1Id)
  if (!token1) return ctx.deleteMessage()

  const chat = {
    chatId: 0,
    chatUsername: '',
    chatTitle: '',
  }

  if (ctx.chat?.type === 'supergroup') {
    chat.chatId = ctx.chat.id
    chat.chatTitle = ctx.chat.title
    chat.chatUsername = `${ctx.chat.username}`
  }

  const addedBy = {
    id: ctx.from?.id || 0,
    name: `${ctx.from?.first_name} ${ctx.from?.last_name}`,
    username: ctx.from?.username,
  }

  const chain = {
    chainId: ctx.session.tokenData.chainId,
    chainName: ctx.session.tokenData.chainName,
    dexId: dex,
  }

  const pariExits = await pairExitsWithChatId(id, ctx.chat?.id || 0)

  if (pariExits.length !== 0) {
    return ctx.answerCallbackQuery('You Already Added Pair Remove It First.')
  }

  if (
    !tokenName ||
    !tokenSymbol ||
    !tokenDecimals ||
    !tokenSupply ||
    !tokenAddress
  )
    return ctx.answerCallbackQuery('Query Expired Do /add tokenAddress Again')

  const tokenAdded = await addToken(
    id,
    chain,
    chat,
    { tokenAddress, tokenName, tokenSymbol, tokenSupply, tokenDecimals },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    token1,
    pairAddress,
    '🟢',
    1,
    0.1,
    addedBy
  )
  if (!tokenAdded)
    return ctx.answerCallbackQuery({
      text: `✅${tokenName} pair On ${dex} Is Already Added!`,
      show_alert: true,
    })

  const pairExits = await checkPairExist(pairAddress)

  if (pairExits) await increasePairCount(pairAddress, 1)
  else {
    const pair = await createPair(
      chain,
      pairAddress,
      { tokenAddress, tokenName, tokenSymbol, tokenSupply, tokenDecimals },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      token1,
      pairSwitched
    )
    //if not pair send error
    if (!pair) return ctx.answerCallbackQuery({ text: "Error Can't Add Pair" })
    const addPair = await SwapListner.startListner({
      token0Decimals: pair.token0.tokenDecimals,
      token0Address: pair.token0.tokenAddress,
      token1Decimals: pair.token1.tokenDecimals,
      token1Address: pair.token1.tokenAddress,
      chain: pair.chain.chainId,
      pairAddress: `${pair.id}`,
      tokenPrice: pair.tokenPrice,
      pairSwitched,
    })

    if (!addPair)
      return ctx.answerCallbackQuery({ text: "Error Can't Add Pair" })

    console.log(
      `${id} - ${chain.chainId} - ${pairSwitched} Added For Swap Listen`
    )
  }

  return ctx.answerCallbackQuery({
    text: `✅${tokenName} pair On ${dex} Added!`,
    show_alert: true,
  })
}

export default addPair
