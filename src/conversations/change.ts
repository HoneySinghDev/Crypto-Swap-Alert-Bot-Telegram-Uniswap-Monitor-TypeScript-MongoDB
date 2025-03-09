import { Router } from '@grammyjs/router'
import { getPairById } from '@/models/Token'
import Context from '@/models/Context'
import handleSettings from '@/handlers/commands/settings'

const changeRouter = new Router<Context>((ctx) => ctx.session?.route)

changeRouter.route('change', async (ctx: Context) => {
  const message = ctx.msg?.text
  const chatId = ctx.chat?.id || 0
  const option = ctx.session.changeOption

  if (!message && !ctx.msg?.photo && !ctx.msg?.animation)
    return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)

  if (message === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(`Canceled`)
  }

  const token = await getPairById(`${chatId}`)

  if (token.length === 0) {
    return ctx.reply('Something went wrong please try again NO Token Found')
  }

  switch (option) {
    case 'minBuy': {
      //if message not interget
      if (!Number(message))
        return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)

      token[0].minBuy = Number(message)

      await ctx.reply(`Min Buy Updated`)
      break
    }
    case 'emoji': {
      //if message not emoji
      if (!message)
        return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)
      token[0].emoji = message

      await ctx.reply(`Emoji Updated`)
      break
    }
    case 'buystep': {
      //if message not interget
      if (!Number(message))
        return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)
      token[0].buyStep = Number(message)

      await ctx.reply(`Buy Step Updated`)
      break
    }
    case 'supply': {
      //if message not interget
      if (!Number(message))
        return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)
      token[0].token0.tokenSupply = Number(message)

      await ctx.reply(`Buy Step Updated`)
      break
    }
    case 'gif': {
      //if message not gif or null
      if (!ctx.msg?.animation && message !== 'null')
        return ctx.reply(`Please Enter Valid Value /cancel To Cancel`)

      token[0].gif =
        message === 'null' ? undefined : ctx.msg?.animation?.file_id

      await ctx.reply(`Gif Updated`)
      break
    }
    default: {
      await ctx.reply(`Something went wrong please try again`)
      break
    }
  }
  await token[0].save()

  ctx.session.route = ''
  const tokenData = await getPairById(`${chatId}`)
  if (tokenData.length === 0) {
    return ctx.reply('Something went wrong please try again NO Token Found')
  }
  ctx.dbChat = tokenData[0]
  await handleSettings(ctx)
})

export default changeRouter
