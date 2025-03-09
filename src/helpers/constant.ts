import env from '@/helpers/env'

const AdminIds: string[] = env.ADMIN_IDS.split(',')

//Dex Exchange Factory Address Query(GetPair)
export const UniswapV2Factory = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f'
export const SushiswapV2Factory = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
export const PancakeswapV2Factory = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
export const TWITSwapFactory = '0x14E3249697D4256ADaCebaA1905a8775acCA29a7'

//'pancakeswap', 'uniswap', 'aveswap', 'sushiswap'
export const supportedDexs = [
  'uniswapv2',
  'sushiswapv2',
  'pancakeswapv2',
  'twitswap',
]

export const Pairs = [
  {
    id: 1,
    chain: 'eth',
    tokenName: 'Wraped Eth',
    tokenSymbol: 'ETH',
    tokenDecimals: 18,
    tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    id: 2,
    chain: 'eth',
    tokenName: 'Tether USD',
    tokenSymbol: 'USDT',
    tokenDecimals: 6,
    tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    id: 4,
    chain: 'eth',
    tokenName: 'BUSD Token',
    tokenSymbol: 'BUSD',
    tokenDecimals: 6,
    tokenAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  },
  {
    id: 5,
    chain: 'bsc',
    tokenName: 'Wraped BNB',
    tokenSymbol: 'BNB',
    tokenDecimals: 18,
    tokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  {
    id: 6,
    chain: 'bsc',
    tokenName: 'BUSD',
    tokenSymbol: 'BUSD',
    tokenDecimals: 6,
    tokenAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
  {
    id: 7,
    chain: 'bsc',
    tokenName: 'Tether USD',
    tokenSymbol: 'USDT',
    tokenDecimals: 6,
    tokenAddress: '0x55d398326f99059ff775485246999027b3197955',
  },
  {
    id: 8,
    chain: 'twitter',
    tokenName: 'Wrapped Twitter Coin',
    tokenSymbol: 'WTC',
    tokenDecimals: 18,
    tokenAddress: '0x3C7ec7e0ce295779FE14c7888479B545A091cf65',
  },
]

export const supportedDexData = [
  {
    chain: 'eth',
    chainName: 'Ethereum',
    dex: 'uniswapv2',
    factoryAddress: UniswapV2Factory,
    pairs: Pairs,
  },
  {
    chain: 'eth',
    chainName: 'Ethereum',
    dex: 'sushiswapv2',
    factoryAddress: SushiswapV2Factory,
    pairs: Pairs,
  },
  {
    chain: 'bsc',
    chainName: 'Binance Smart Chain',
    dex: 'pancakeswapv2',
    factoryAddress: PancakeswapV2Factory,
    pairs: Pairs,
  },
  {
    chain: 'twit',
    chainName: 'Twitter Chain',
    dex: 'TWITSwap',
    factoryAddress: TWITSwapFactory,
    pairs: Pairs,
  },
]
//  { chain: 'bsc', dex: 'quickswap', pairs: 'wbnb,wusd' },

export const charts = [
  {
    id: 1,
    name: 'PooCoin',
    url: 'https://poocoin.app/tokens/${pairAddress}',
  },
  {
    id: 2,
    name: 'Bogged',
    url: 'https://charts.bogged.finance/?page=chart&c=${chain}&t=${pairAddress}',
  },
  {
    id: 3,
    name: 'DexScreener',
    url: 'https://dexscreener.com/${chain}/${pairAddress}',
  },
]

//get chart url with token address and chain of id
export function getChartUrl(id: number, pairAddress: string, chain: string) {
  const chart = charts.find((c) => c.id === id)
  if (chart) {
    return chart.url
      .replace('${pairAddress}', pairAddress)
      .replace('${chain}', chain)
  }
  return ''
}

export default AdminIds
