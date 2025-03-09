import { Menu } from '@grammyjs/menu'
import { charts } from '@/helpers/constant'
import Context from '@/models/Context'

const handleChatMenu = async (ctx: Context) => {
  const chartId = Number(ctx.match)
  if (!chartId) return ctx.answerCallbackQuery('Error')
  ctx.dbChat.chartId = chartId
  await ctx.dbChat.save()
  await ctx.answerCallbackQuery(`Chart Changed`)
  await ctx.menu.update({
    immediate: true,
  })
}

const chartMenu = new Menu<Context>('chartMenu', {
  onMenuOutdated: async (ctx) => {
    await ctx.answerCallbackQuery('Menu outdated please try again')
    ctx.menu.update()
  },
}).dynamic((ctx, range) => {
  const selectedChartId = ctx.dbChat.chartId || 1
  charts.forEach((chart, index) => {
    if (index % 3 === 0) {
      range.row()
    }
    range.text(
      {
        text: `${selectedChartId === chart.id ? '✅' : ''} ${chart.name}`,
        payload: `${chart.id}`,
      },
      handleChatMenu
    )
  })
  range.row()
  range.back('🔙 Back')
})

const handleTokenPreference = async (ctx: Context, option: string) => {
  switch (option) {
    case 'selectedChart': {
      break
    }
    case 'circulatingSupply': {
      ctx.session.route = 'change'
      ctx.session.changeOption = 'supply'
      await ctx.answerCallbackQuery(`Enter Supply to update`)
      await ctx.reply(
        `➡️ Send me circulating supply. (No dots and commas allowed e.g. 111222333444, to delete existing value if was maually set before, send '0')`
      )
      break
    }
    default: {
      await ctx.answerCallbackQuery(`Something went wrong please try again`)
      break
    }
  }
}

export const tokenPreferenceMenu = new Menu<Context>('tokenPreference')
  .submenu(`Selected Chart`, 'chartMenu')
  .row()
  .text(`🔂 Circulating Supply`, (ctx) =>
    handleTokenPreference(ctx, 'circulatingSupply')
  )
  .row()
  .back('🔙 Go Back')

tokenPreferenceMenu.register(chartMenu)

const handleKeyboardSettings = async (ctx: Context, option: string) => {
  switch (option) {
    case 'showgif': {
      ctx.session.route = 'change'
      ctx.session.changeOption = 'gif'
      await ctx.answerCallbackQuery(`Send gif to update`)
      await ctx.reply(`Send gif to upgate or null to remove`)
      break
    }
    case 'minBuy': {
      ctx.session.route = 'change'
      ctx.session.changeOption = 'minBuy'
      await ctx.answerCallbackQuery(`Send min buy to upgate`)
      await ctx.reply(`Send min buy to update`)
      break
    }
    case 'emoji': {
      ctx.session.route = 'change'
      ctx.session.changeOption = 'emoji'
      await ctx.answerCallbackQuery(`Send emoji to upgate`)
      await ctx.reply(`Send emoji to update`)
      break
    }
    case 'buystep': {
      ctx.session.route = 'change'
      ctx.session.changeOption = 'buystep'
      await ctx.answerCallbackQuery(`Send buy step to upgate`)
      await ctx.reply(`Send buy step to update`)
      break
    }
    case 'preferences': {
      await ctx.answerCallbackQuery('Preferences')
      break
    }
    default: {
      await ctx.answerCallbackQuery(`Something went wrong please try again`)
      break
    }
  }
}

const settingMenu = new Menu<Context>('settings')
  .text('🌠 Gif / Image', (ctx) => handleKeyboardSettings(ctx, 'showgif'))
  .text(
    (ctx) => `Min Buy $${ctx.dbChat.minBuy}`,
    (ctx) => handleKeyboardSettings(ctx, 'minBuy')
  )
  .row()
  .text(
    (ctx) => `${ctx.dbChat.emoji} Emoji`,
    (ctx) => handleKeyboardSettings(ctx, 'emoji')
  )
  .text(
    (ctx) => `Buy Step $${ctx.dbChat.buyStep}`,
    (ctx) => handleKeyboardSettings(ctx, 'buystep')
  )
  .row()
  .submenu('⚙️ Token And Group Prefernces', 'tokenPreference')
  .row()

settingMenu.register(tokenPreferenceMenu)

export default settingMenu
