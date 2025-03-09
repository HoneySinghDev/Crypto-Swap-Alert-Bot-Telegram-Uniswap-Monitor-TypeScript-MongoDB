import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default function handleStart(ctx: Context) {
  return ctx.reply(
    `Hi! I am CryptoBuyBot, just add me to a group and let's start monitor some fresh buys together!
Type /help to get list of commands.
  
Please note that this is the Free Version of CryptoBuyBot!
  
Official Group: @TheNoobDeveloper`,
    sendOptions(ctx)
  )
}
