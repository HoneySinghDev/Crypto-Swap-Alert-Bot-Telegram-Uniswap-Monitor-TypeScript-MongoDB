import { Context as BaseContext, SessionFlavor } from 'grammy'
import { DocumentType } from '@typegoose/typegoose'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { I18nContext } from '@grammyjs/i18n/dist/source'
import { MenuFlavor } from '@grammyjs/menu'
import { Session } from '@/helpers/session'
import { TokenData } from '@/models/Token'
import { User } from '@/models/User'

class MyContext extends BaseContext {
  readonly i18n!: I18nContext
  dbuser!: DocumentType<User>
  dbChat!: DocumentType<TokenData>
}
type Context = HydrateFlavor<MyContext> & SessionFlavor<Session> & MenuFlavor
export default Context
