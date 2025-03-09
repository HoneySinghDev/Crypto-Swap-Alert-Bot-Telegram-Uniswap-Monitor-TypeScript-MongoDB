import Context from '@/models/Context'

export default async function handleHelp(ctx: Context) {
  await ctx.reply(
    `Hello ${ctx.from?.first_name}!\n` +
      `I'm a bot that helps you to manage your pairs in a group chat.\n` +
      `You can use the following commands:\n` +
      `/add - Add a new pair to the group\n` +
      `/remove - Remove a pair from the group\n` +
      `/settings - Change the settings of the group\n` +
      `/help - Show this message\n`
  )
}
