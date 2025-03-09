import { InlineKeyboard } from 'grammy'
import { Pairs } from '@/helpers/constant'
import { fetchPairAddress, getdexPairs } from '@/utils/ethers/getPair'
import { getBscToken, getErcToken, getTwitToken } from '@/utils/ethers/getToken'
import { getPairById } from '@/models/Token'
import { isAddress } from 'ethers/lib/utils'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleAddToken(ctx: Context) {
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

  if (!isAddress(TokenAddress))
    return message.editText(
      'Please Send a Valid Token address',
      sendOptions(ctx)
    )

  const pariExits = await getPairById(`${ctx.chat?.id}`)

  if (pariExits.length !== 0) {
    return message.editText(
      `❗️ Bot already in use in this group for token\n` +
        `<code>${pariExits[0].token0.tokenAddress}</code>`,
      sendOptions(ctx)
    )
  }

  const bsctokenData = await getBscToken(TokenAddress)
  if (bsctokenData) {
    ctx.session.tokenData = {
      chainId: 'bsc',
      chainName: 'Binance Smart Chain',
      ...bsctokenData,
      tokenAddress: TokenAddress,
    }
  } else {
    const ethtokenData = await getErcToken(TokenAddress)
    if (ethtokenData) {
      ctx.session.tokenData = {
        chainId: 'eth',
        chainName: 'Ethereum',
        ...ethtokenData,
        tokenAddress: TokenAddress,
      }
    } else {
      const twittokenData = await getTwitToken(TokenAddress)
      if (twittokenData) {
        ctx.session.tokenData = {
          chainId: 'twit',
          chainName: 'Twitter',
          ...twittokenData,
          tokenAddress: TokenAddress,
        }
      }
    }
  }

  if (!ctx.session.tokenData.chainId)
    return message.editText(
      'Please Send a Valid Token address',
      sendOptions(ctx)
    )

  const pairKeyboard = new InlineKeyboard()

  const chain = ctx.session.tokenData.chainId
  const token1Address = ctx.session.tokenData.tokenAddress

  const dexPairs = getdexPairs(chain)

  pairKeyboard.text(`🟢 ${ctx.session.tokenData.chainName} 🟢`).row()

  await Promise.all(
    dexPairs.map(
      async ({ tokenName, tokenAddress, chain, dex, factoryAddress }) => {
        const pair = await fetchPairAddress(
          chain,
          factoryAddress,
          token1Address,
          tokenAddress
        )
        if (pair) {
          console.log(pair)
          const {
            pairsAddress,
            token0Contract,
            token1Contract,
            token1Id,
            pairSwitched,
          } = pair
          ctx.session.token0Contract = token0Contract
          const _pairSwitched = pairSwitched ? '1' : '0'

          pairKeyboard
            .text(
              `${ctx.session.tokenData.tokenName}/${tokenName} pair on ${dex}`,
              `a-${dex}-${pairsAddress}-${token1Id}-${_pairSwitched}`
            )
            .row()
        }
      }
    )
  )

  pairKeyboard.text('Done ✅', `a-done-done`)
  await message.delete()
  return ctx.reply(
    `Select The Pair You Want To Add To Your Group From Below Options:`,
    {
      ...sendOptions(ctx),
      reply_markup: pairKeyboard,
    }
  )
}
