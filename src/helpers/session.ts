import { session as session_ } from 'grammy'

export interface Session {
  route: string
  changeOption: string
  tokenData: {
    chainId: 'eth' | 'bsc' | 'twit'
    chainName: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    tokenSupply: number
    tokenAddress: string
  }
  token0Contract: string
  token1Contract: string
}

export const initial = (): Session => ({
  route: '',
  changeOption: '',
  tokenData: {
    chainId: 'eth',
    chainName: '',
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: 0,
    tokenSupply: 0,
    tokenAddress: '',
  },
  token0Contract: '',
  token1Contract: '',
})

export const session = session_({ initial })
