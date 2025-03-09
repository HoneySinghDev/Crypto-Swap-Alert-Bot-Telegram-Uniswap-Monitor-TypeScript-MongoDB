import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'

//{ path: resolve(cwd(), '.env') }
dotenv.config()

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  TOKEN: str(),
  MONGO: str(),

  HTTP_URL_eth: str(),
  WSS_URL_eth: str(),

  HTTP_URL_bsc: str(),
  WSS_URL_bsc: str(),

  HTTP_URL_twitter: str(),

  ADMIN_IDS: str(),
  RAILWAY_STATIC_URL: str(),

  UV_THREADPOOL_SIZE: num(),
})
