import * as console from 'console'
import {
  findAllTokenPairsByPairAddress,
  getAllPair,
  increaseTransCount,
} from '@/models/Token'
import { getChartUrl } from '@/helpers/constant'
import Big from 'big.js'
import _SwapListner from '@/helpers/tradeListner'
import bot from '@/helpers/bot'

export const sendMessage = async (
  pairAddress: string,
  tokenPrice: number,
  sender: string,
  buyAmount: Big,
  sellAmount: Big,
  buyPrice: string,
  buyerPosition: false | string,
  to: string,
  transhash: string
) => {
  const tokengroups = await findAllTokenPairsByPairAddress(pairAddress)
  const _pair = await getAllPair()

  if (tokengroups.length === 0 || !_pair) return

  await Promise.all(
    tokengroups.map(async (token) => {
      const { chatId } = token.chat
      const { emoji, minBuy, emojiAmount } = token
      const _buyAmount = buyAmount.toNumber()
      const _sellAmount = sellAmount.toNumber()
      let emojiString =
        `${emoji}`.repeat(sellAmount.mul(emojiAmount).toNumber()) || emoji

      // if emoji more than 30
      if (emojiString.length > 30) {
        emojiString = emojiString.slice(0, 30)
      }

      //sort _pair by transCount and get postion of pairAddress
      const tokenPositon = tokengroups
        .sort((a, b) => a.transCount - b.transCount)
        .findIndex(({ chat }) => chat.chatId === token.chat.chatId)

      // if buyAmount less than minBuy return console.log Below Min Buy Amount Alert Limit
      if (_buyAmount < minBuy)
        return console.log(
          `Below Alert Limit Buy Amount is ${_buyAmount} | sellAmount: ${_sellAmount} for ${pairAddress} tx: ${transhash}`
        )

      const TxHashLink =
        token.chain.chainId === 'eth'
          ? 'https://etherscan.io/tx/'
          : token.chain.chainId === 'bsc'
          ? 'https://bscscan.com/tx/'
          : 'https://explore.twitterchain.net/tx/'

      const BuyToken = `https://app.bogged.finance/${token.chain.chainId}/swap?tokenIn=${token.token0.tokenAddress}&tokenOut=${token.token1.tokenAddress}`

      const chart = getChartUrl(
        token.chartId || 1,
        token.pairAddress,
        token.chain.chainId
      )

      const message = `
🔥 #${tokenPositon + 1} ${token.chat.chatTitle}

<b>DEXTools Buy!</b>
${emojiString}
<b>Spend</b>: ${_sellAmount}
<b>Got</b>: ${_buyAmount}
Buyer Position: ${buyerPosition ? `⬆️ ${buyerPosition} %` : 'New'}
<b>Dex</b>: ${token.chain.dexId} (${token.chain.chainName})
<b>Price</b>: ${buyPrice}
<b>MarketCap</b>: $${token.token0.tokenSupply * tokenPrice}
<a href="${TxHashLink}${transhash}">TxHash</a> | <a href="${BuyToken}">Buy</a> | <a href="${chart}">View on DEX</a>
`
      await increaseTransCount(chatId, pairAddress)

      if (token.gif) {
        return bot.api
          .sendAnimation(chatId, token.gif, {
            caption: message,
            parse_mode: 'HTML',
          })
          .catch(() => console.log('Error Sending Gif'))
      } else
        return bot.api
          .sendMessage(chatId, message, {
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
          })
          .catch(() => console.log('Error Sending Message'))
    })
  )
}

const checkTrade = async () => {
  const pairs = await getAllPair()
  if (!pairs || pairs.length === 0) return false
  for (const pair of pairs) {
    const { id, chain, pairSwitched, token0, token1 } = pair

    //Start Pair
    await _SwapListner.startListner({
      token0Decimals: token0.tokenDecimals,
      token0Address: token0.tokenAddress,
      token1Decimals: token1.tokenDecimals,
      token1Address: token1.tokenAddress,
      chain: chain.chainId,
      pairAddress: `${id}`,
      tokenPrice: pair.tokenPrice,
      pairSwitched: pairSwitched,
    })
    console.log(
      `${id} - ${chain.chainId} - ${pairSwitched} Added For Swap Listen`
    )
  }
}

export default checkTrade
