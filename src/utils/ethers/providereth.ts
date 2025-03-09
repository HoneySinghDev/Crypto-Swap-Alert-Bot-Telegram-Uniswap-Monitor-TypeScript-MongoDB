import { ethers } from 'ethers'
import env from '@/helpers/env'

// loading env vars
const HTTP_URL = env.HTTP_URL_eth
export const EthhttpProvider = new ethers.providers.JsonRpcProvider(HTTP_URL)
export const EthwssProvider = new ethers.providers.WebSocketProvider(
  env.WSS_URL_eth
)
