import { ethers } from 'ethers'
import env from '@/helpers/env'

// loading env vars
const HTTP_URL = env.HTTP_URL_twitter
export const TwithttpProvider = new ethers.providers.JsonRpcProvider(HTTP_URL)
// export const TwitwssProvider = new ethers.providers.WebSocketProvider(
//   env.WSS_URL_twitter
// )
export default TwithttpProvider
