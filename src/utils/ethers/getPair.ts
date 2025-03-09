import * as factoryABI from '@/utils/contracts/IUniswapV2Factory.json'
import * as pairABI from '@/utils/contracts/IUniswapV2Pair.json'
import { BschttpProvider } from '@/utils/ethers/providerbsc'
import { Contract, ethers } from 'ethers'
import { EthhttpProvider } from '@/utils/ethers/providereth'
import { Pairs, supportedDexData } from '@/helpers/constant'
import { TwithttpProvider } from '@/utils/ethers/providertwit'

export const getdexPairs = (chain: 'eth' | 'bsc' | 'twit') => {
  const dexPairs: {
    tokenName: string
    tokenSymbol: string
    tokenAddress: string
    chain: 'eth' | 'bsc' | 'twit'
    dex: string
    factoryAddress: string
  }[] = []
  supportedDexData.map(({ chain: dexChain, dex, pairs, factoryAddress }) => {
    pairs.forEach(({ tokenName, tokenSymbol, tokenAddress }) => {
      if (dexChain === chain)
        dexPairs.push({
          tokenName,
          tokenSymbol,
          tokenAddress,
          chain: dexChain,
          dex,
          factoryAddress,
        })
    })
  })

  return dexPairs
}

export const fetchPairAddress = async (
  chain: 'eth' | 'bsc' | 'twit',
  factoryAddress: string,
  token0Address: string,
  token1Address: string
) => {
  try {
    let tokenContract: Contract
    if (chain === 'eth')
      tokenContract = new ethers.Contract(
        factoryAddress,
        factoryABI.abi,
        EthhttpProvider
      )
    else if (chain === 'bsc')
      tokenContract = new ethers.Contract(
        factoryAddress,
        factoryABI.abi,
        BschttpProvider
      )
    else if (chain === 'twit')
      tokenContract = new ethers.Contract(
        factoryAddress,
        factoryABI.abi,
        TwithttpProvider
      )
    else throw new Error('chain not supported')

    const pairsAddress: string = await tokenContract.getPair(
      token0Address,
      token1Address
    )

    if (pairsAddress === '0x0000000000000000000000000000000000000000')
      return false

    const TokenContract = await getTokenContract(chain, pairsAddress)

    if (!TokenContract) return false

    const { token0Contract, token1Contract, token1Id, pairSwitched } =
      TokenContract

    return {
      pairsAddress,
      token0Contract,
      token1Contract,
      token1Id,
      pairSwitched,
    }
  } catch (err) {
    return false
  }
}

export const getTokenContract = async (
  chain: 'eth' | 'bsc' | 'twit',
  pairAddress: string
) => {
  let tokenContract: Contract
  if (chain === 'eth')
    tokenContract = new ethers.Contract(
      pairAddress,
      pairABI.abi,
      EthhttpProvider
    )
  else if (chain === 'bsc')
    tokenContract = new ethers.Contract(
      pairAddress,
      pairABI.abi,
      BschttpProvider
    )
  else if (chain === 'twit')
    tokenContract = new ethers.Contract(
      pairAddress,
      pairABI.abi,
      TwithttpProvider
    )
  else throw new Error('chain not supported')

  const token0Contract: string = await tokenContract.token0()
  const token1Contract: string = await tokenContract.token1()

  let pairSwitched: boolean
  let token1: number

  if (Pairs.some((pair) => pair.tokenAddress === token0Contract)) {
    pairSwitched = true

    token1 =
      Pairs.find((pair) => {
        if (pair.tokenAddress.toLowerCase() == token0Contract.toLowerCase())
          return pair
        else return false
      })?.id || 0
  } else {
    pairSwitched = false

    token1 =
      Pairs.find((pair) => {
        if (pair.tokenAddress.toLowerCase() == token1Contract.toLowerCase())
          return pair
        else return false
      })?.id || 0
  }

  if (!token1) return false
  //deploy
  return { token0Contract, token1Contract, pairSwitched, token1Id: token1 }
}
