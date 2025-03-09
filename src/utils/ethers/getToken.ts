import * as tokenAbi from '@/utils/contracts/token.json'
import { BschttpProvider } from '@/utils/ethers/providerbsc'
import { EthhttpProvider } from '@/utils/ethers/providereth'
import { TwithttpProvider } from '@/utils/ethers/providertwit'
import { ethers } from 'ethers'

export async function getErcToken(address: string) {
  try {
    const tokenContract = new ethers.Contract(
      address,
      tokenAbi.abi,
      EthhttpProvider
    )

    const tokenName: string = await tokenContract.name()
    const tokenSymbol: string = await tokenContract.symbol()
    const tokenDecimals: number = await tokenContract.decimals()
    let tokenSupply: number = await tokenContract.totalSupply()
    tokenSupply = tokenSupply / Number(`1${'0'.repeat(tokenDecimals)}`)
    return { tokenName, tokenSymbol, tokenDecimals, tokenSupply }
  } catch (err) {
    return false
  }
}
//get twit token
export async function getTwitToken(address: string) {
  try {
    const tokenContract = new ethers.Contract(
      address,
      tokenAbi.abi,
      TwithttpProvider
    )

    const tokenName: string = await tokenContract.name()
    const tokenSymbol: string = await tokenContract.symbol()
    const tokenDecimals: number = await tokenContract.decimals()
    let tokenSupply: number = await tokenContract.totalSupply()
    tokenSupply = tokenSupply / Number(`1${'0'.repeat(tokenDecimals)}`)
    return { tokenName, tokenSymbol, tokenDecimals, tokenSupply }
  } catch (err) {
    return false
  }
}

export async function getBscToken(address: string) {
  try {
    const tokenContract = new ethers.Contract(
      address,
      tokenAbi.abi,
      BschttpProvider
    )

    const tokenName: string = await tokenContract.name()
    const tokenSymbol: string = await tokenContract.symbol()
    const tokenDecimals: number = await tokenContract.decimals()
    let tokenSupply: number = await tokenContract.totalSupply()
    tokenSupply = tokenSupply / Number(`1${'0'.repeat(tokenDecimals)}`)
    return { tokenName, tokenSymbol, tokenDecimals, tokenSupply }
  } catch (err) {
    return false
  }
}
