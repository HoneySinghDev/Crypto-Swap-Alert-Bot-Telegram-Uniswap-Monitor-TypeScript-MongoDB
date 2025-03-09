import * as pairABI from '@/utils/contracts/IUniswapV2Pair.json'
import * as tokenABI from '@/utils/contracts/token.json'

import { BschttpProvider, BscwssProvider } from '@/utils/ethers/providerbsc'
import { Contract, Event, ethers } from 'ethers'
import { EthhttpProvider, EthwssProvider } from '@/utils/ethers/providereth'
import { TwithttpProvider } from '@/utils/ethers/providertwit'
import { sendMessage } from '@/helpers/checkTrade'
import Big from 'big.js'

export async function getBuyerPosition(
  chain: 'eth' | 'bsc' | 'twit',
  tokenAddress: string,
  token0Decimals_: number,
  buyerAddress: string,
  buyAmount: Big
) {
  let tokenContract: Contract
  if (chain === 'eth') {
    tokenContract = new ethers.Contract(
      tokenAddress,
      tokenABI.abi,
      EthhttpProvider
    )
  } else if (chain === 'bsc') {
    tokenContract = new ethers.Contract(
      tokenAddress,
      tokenABI.abi,
      BschttpProvider
    )
  } else if (chain === 'twit') {
    tokenContract = new ethers.Contract(
      tokenAddress,
      tokenABI.abi,
      TwithttpProvider
    )
  } else {
    throw new Error('chain not supported')
  }

  //Get Balance Of Token tokenContract.balanceOf(buyerAddress)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const buyerBalance = Big(await tokenContract.balanceOf(buyerAddress)).div(
    parseFloat(`1${'0'.repeat(token0Decimals_)}`)
  )

  if (buyerBalance.toNumber() === 0) return false

  //Get Percentage of buyerBalance and buyAmount
  const percentage = buyAmount.div(buyerBalance).mul(100)
  return percentage.toFixed(2)
}

export default function addTradeListner(
  token0Decimals_: number,
  token0Address_: string,
  token1Decimals_: number,
  token1Address_: string,
  chain: 'eth' | 'bsc' | 'twit',
  pairAddress: string,
  pairSwitch: boolean
) {
  if (chain === 'bsc') return
  let tokenContract: Contract
  if (chain === 'eth') {
    tokenContract = new ethers.Contract(
      pairAddress,
      pairABI.abi,
      EthwssProvider
    )
    // } else if (chain === 'bsc') {
    //   tokenContract = new ethers.Contract(
    //     pairAddress,
    //     pairABI.abi,
    //     BschttpProvider
    //   )
    // }
  } else if (chain === 'twit') {
    tokenContract = new ethers.Contract(
      pairAddress,
      pairABI.abi,
      TwithttpProvider
    )
  } else {
    throw new Error('chain not supported')
  }

  // if (pairSwitch) {
  //   reserves.reserve1
  // } else {
  //   reserves.reserve0
  // }

  tokenContract.on(
    'Swap',
    async (
      sender: string,
      amount0In: string,
      amount1In: string,
      amount0Out: string,
      amount1Out: string,
      to: string,
      event: Event
    ) => {
      try {
        let buyAmount: Big
        let sellAmount: Big
        if (pairSwitch) {
          buyAmount = Big(amount1Out)
          sellAmount = Big(amount0In)
        } else {
          buyAmount = Big(amount0Out)
          sellAmount = Big(amount1In)
        }
        if (sellAmount.toString() === '0')
          return console.log(
            `Sell Amount is 0, so it's not a Buy trade ${event.transactionHash}`
          )

        buyAmount = buyAmount.div(parseFloat(`1${'0'.repeat(token0Decimals_)}`))

        sellAmount = sellAmount.div(
          parseFloat(`1${'0'.repeat(token1Decimals_)}`)
        )

        const buyPrice = sellAmount.div(buyAmount).toFixed(8)

        const buyerPosition = await getBuyerPosition(
          chain,
          token0Address_,
          token0Decimals_,
          to,
          buyAmount
        )

        return sendMessage(
          pairAddress,
          0,
          sender,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          buyAmount,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          sellAmount,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          buyPrice,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          buyerPosition,
          to,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          event.transactionHash
        )
      } catch (err) {
        console.log(err)
      }
    }
  )
}
