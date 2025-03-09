import { getAllActiveTokens } from '@/models/Token'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleTrending(ctx: Context) {
  //
  const tokens = await getAllActiveTokens()

  if (tokens.length === 0) {
    return ctx.reply('No trending tokens found', sendOptions(ctx))
  }

  //get all bsc tokens from tokens
  const bscTokens = tokens.filter((token) => token.chain.chainId === 'bsc')
  //get all eth tokens from tokens
  const ethTokens = tokens.filter((token) => token.chain.chainId === 'eth')

  //sort bsc tokens by transCount desc
  const bscTokensSorted = bscTokens
    .sort((a, b) => {
      return b.transCount - a.transCount
    })
    .slice(0, 10)
  //sort eth tokens by transCount desc limit 10

  const ethTokensSorted = ethTokens
    .sort((a, b) => {
      return b.transCount - a.transCount
    })
    .slice(0, 10)

  const bscTokenList = bscTokensSorted
    .map(
      (token, index) =>
        `#${index + 1} ${
          token.chat.chatUsername
            ? `<a href='t.me/${token.chat.chatUsername}'>${token.token0.tokenName}</a>`
            : token.token0.tokenName
        } ($${token.token0.tokenSymbol})`
    )
    .join('\n')

  const ethTokenList = ethTokensSorted
    .map(
      (token, index) =>
        `#${index + 1} ${
          token.chat.chatUsername
            ? `<a href='t.me/${token.chat.chatUsername}'>${token.token0.tokenName}</a>`
            : token.token0.tokenName
        } ($${token.token0.tokenSymbol})`
    )
    .join('\n')

  const message = `
🔥 TOP TRENDING (LIVE - BSC) 🔥\n
${bscTokenList.length > 0 ? bscTokenList : 'No trending tokens found'}
------------------------\n\n
🔥 TOP TRENDING (LIVE - ETH) 🔥\n
${ethTokenList.length > 0 ? ethTokenList : 'No trending tokens found'}
`
  return ctx.reply(message, sendOptions(ctx))
}
