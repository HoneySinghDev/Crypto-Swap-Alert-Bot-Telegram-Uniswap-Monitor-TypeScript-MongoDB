//
import * as pairABI from '@/utils/contracts/IUniswapV2Pair.json'
//
import { BschttpProvider } from '@/utils/ethers/providerbsc'
import { Contract, Event, ethers } from 'ethers'
import { EthhttpProvider } from '@/utils/ethers/providereth'
import { TwithttpProvider } from '@/utils/ethers/providertwit'
import { changetokenPrice } from '@/models/Token'
import { getBuyerPosition } from '@/utils/ethers/getTrade'
import { sendMessage } from '@/helpers/checkTrade'
import Big from 'big.js'
import axios from 'axios'

interface Pair {
  token0Decimals: number
  token0Address: string
  token1Decimals: number
  token1Address: string
  chain: 'eth' | 'bsc' | 'twit'
  pairAddress: string
  tokenPrice: number
  pairSwitched: boolean
}

class SwapListner {
  private listners: Map<string, Contract>

  constructor() {
    this.listners = new Map<string, Contract>()
  }

  /**
   * Creates New Listners for Swaps
   *
   * @param pair Pair
   * @returns void
   */
  private async init(pair: Pair) {
    let tokenContract: Contract
    if (pair.chain === 'eth') {
      tokenContract = new ethers.Contract(
        pair.pairAddress,
        pairABI.abi,
        EthhttpProvider
      )
    } else if (pair.chain === 'bsc') {
      tokenContract = new ethers.Contract(
        pair.pairAddress,
        pairABI.abi,
        BschttpProvider
      )
    } else if (pair.chain === 'twit') {
      tokenContract = new ethers.Contract(
        pair.pairAddress,
        pairABI.abi,
        TwithttpProvider
      )
    } else {
      throw new Error('chain not supported')
    }
    const reserves = await tokenContract.getReserves()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const reserve0 = Big(reserves.reserve0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const reserve1 = Big(reserves.reserve1)

    let tokenPrice: Big

    if (pair.pairSwitched) {
      const price = reserve1.div(reserve0)
      const adjusted_price = price.div(
        10 ** (pair.token0Decimals - pair.token1Decimals)
      )
      tokenPrice = Big(1).div(adjusted_price)
    } else {
      const price = reserve0.div(reserve1)
      const adjusted_price = price.div(
        10 ** (pair.token1Decimals - pair.token0Decimals)
      )
      tokenPrice = Big(1).div(adjusted_price)
    }

    if (pair.chain === 'eth') {
      //curent token price to usd axios
      const tokenPriceUSD = await axios.get(
        `https://api.coinbase.com/v2/prices/ETH-USD/buy`
      )
      // convert tokenPriceUsd to tokenPrice
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      tokenPrice = Big(tokenPriceUSD.data.data.amount).mul(tokenPrice)
    }
    if (pair.chain === 'bsc') {
      const tokenPriceUSD = await axios.get(
        `https://api.coinbase.com/v2/exchange-rates?currency=BNB`
      )
      // convert tokenPriceUsd to tokenPrice
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      tokenPrice = Big(tokenPriceUSD.data.data.rates.USD).mul(tokenPrice)
    }
    await changetokenPrice(pair.pairAddress, tokenPrice.toNumber())

    this.startListening(pair, tokenContract)
  }

  private async OnSwap(
    pair: Pair,
    sender: string,
    amount0In: string,
    amount1In: string,
    amount0Out: string,
    amount1Out: string,
    to: string,
    event: Event
  ) {
    try {
      let buyAmount: Big
      let sellAmount: Big
      if (!pair.pairSwitched) {
        buyAmount = Big(amount0Out)
        sellAmount = Big(amount1In)
      } else {
        buyAmount = Big(amount1Out)
        sellAmount = Big(amount0In)
      }
      console.log(
        `amount0Out is ${amount0Out} | amount1In: ${amount1In} for ${pair.pairAddress} | tx: ${event.transactionHash}`
      )
      if (sellAmount.toString() === '0')
        return console.log(
          `Not Buying ${pair.pairAddress} | tx: ${event.transactionHash}`
        )

      buyAmount = buyAmount.div(Number(`1${'0'.repeat(pair.token0Decimals)}`))

      sellAmount = sellAmount.div(Number(`1${'0'.repeat(pair.token1Decimals)}`))

      const buyPrice = sellAmount.div(buyAmount || 1).toFixed(8)

      const buyerPosition = await getBuyerPosition(
        pair.chain,
        pair.token0Address,
        pair.token0Decimals,
        to,
        buyAmount
      )

      return sendMessage(
        pair.pairAddress,
        pair.tokenPrice,
        sender,
        buyAmount,
        sellAmount,
        buyPrice,
        buyerPosition,
        to,
        event.transactionHash
      )
    } catch (err) {
      console.log(err)
    }
  }

  private startListening(pair: Pair, tokenContract: Contract) {
    const listner = tokenContract.on(
      'Swap',
      async (
        sender: string,
        amount0In: string,
        amount1In: string,
        amount0Out: string,
        amount1Out: string,
        to: string,
        event: Event
      ) =>
        await this.OnSwap(
          pair,
          sender,
          amount0In,
          amount1In,
          amount0Out,
          amount1Out,
          to,
          event
        )
    )
    this.listners.set(pair.pairAddress, listner)
    // listner.removeAllListeners('Swap')
  }

  /**
   * Checks if listner is exit if not adds it
   *
   * @param pair Pair
   * @returns boolean
   */
  public async startListner(pair: Pair) {
    if (!this.listners.has(pair.pairAddress)) {
      console.log(`Starting Listner for ${pair.pairAddress}`)
      await this.init(pair)
      return true
    } else {
      console.log(`Listner already running for ${pair.pairAddress}`)
      return true
    }
  }

  /**
   * Checks if Listner has been initialized for the chat
   *
   * @param pairAddress string
   * @returns boolean
   */
  has(pairAddress: string) {
    return this.listners.has(pairAddress)
  }

  /**
   * Deletes the listner instance for the chat
   *
   * @param pairAddress string
   * @returns boolean
   */
  delete(pairAddress: string) {
    return this.listners.delete(pairAddress)
  }

  /**
   * Destroy the listner and remove listner instance
   *
   * @param pairAddress string
   * @returns boolean
   */
  stopListner(pairAddress: string) {
    const listner = this.listners.get(pairAddress)
    this.listners.delete(pairAddress)
    if (!listner) {
      return false
    }
    if (listner.removeAllListeners()) {
      return true
    }
    return false
  }

  //stop all listners
  public stopAllListners() {
    this.listners.forEach((listner, pairAddress) => {
      this.stopListner(pairAddress)
    })
  }
}

const _SwapListner = new SwapListner()
export default _SwapListner
