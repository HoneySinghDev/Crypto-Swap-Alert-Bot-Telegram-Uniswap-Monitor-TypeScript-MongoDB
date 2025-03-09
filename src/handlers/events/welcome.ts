import Context from '@/models/Context'

export default function welcomeHandler(ctx: Context) {
  const message = `
Hey everyone,CryptoBuyBot  (KBB) here! Please note that this is the Free Version of CryptoBuyBot!
Type '/add address' to start!`
  return ctx.reply(message)
}
