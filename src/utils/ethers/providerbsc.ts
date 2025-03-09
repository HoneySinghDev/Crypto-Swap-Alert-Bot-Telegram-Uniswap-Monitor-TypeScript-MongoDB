import { ethers } from 'ethers'
import env from '@/helpers/env'

// loading env vars
const HTTP_URL = env.HTTP_URL_bsc
export const BschttpProvider = new ethers.providers.JsonRpcProvider(HTTP_URL)
export const BscwssProvider = new ethers.providers.WebSocketProvider(
  env.WSS_URL_bsc
)
