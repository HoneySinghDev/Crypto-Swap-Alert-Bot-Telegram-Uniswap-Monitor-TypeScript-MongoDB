import { Composer } from 'grammy'
import Context from '@/models/Context'
import welcomeHandler from '@/handlers/events/welcome'

const eventHandler = new Composer<Context>()

eventHandler.on(':new_chat_members', welcomeHandler)
// eventHandler.on(':new_chat_members', welcomeHandler)

export default eventHandler
