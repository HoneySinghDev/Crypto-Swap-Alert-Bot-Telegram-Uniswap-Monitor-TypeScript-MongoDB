import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: { timestamps: true },
})
class tokenData {
  @prop({ required: true, trim: true })
  tokenAddress!: string

  @prop({ required: true, trim: true })
  tokenName!: string

  @prop({ required: true, trim: true })
  tokenSymbol!: string

  @prop({ required: false })
  tokenSupply!: number

  @prop({ required: true })
  tokenDecimals!: number
}

@modelOptions({
  options: { allowMixed: 0, customName: 'tokenGroupData' },
  schemaOptions: { timestamps: true },
})
export class TokenData {
  @prop({ required: true, index: true, unique: true })
  id!: string

  @prop({ required: true, default: true })
  isActive!: boolean

  @prop()
  chain!: { chainId: string; chainName: string; dexId: string }

  @prop({ required: true })
  chat!: { chatId: number; chatUsername: string | undefined; chatTitle: string }

  @prop()
  token0!: tokenData

  @prop()
  token1!: tokenData

  @prop()
  token1Name!: string

  @prop()
  token0ContractAddress!: string

  @prop()
  token1ContractAddress!: string

  @prop({ required: true, trim: true })
  pairAddress!: string

  @prop({ required: true, trim: true, default: '🟢' })
  emoji!: string

  @prop({ required: true, default: 5 })
  emojiAmount!: number

  @prop({ required: true, default: 0.5 })
  minBuy!: number

  @prop({ required: true, default: 0 })
  buyStep!: number

  @prop({ required: true })
  addedBy!: { id: string; name: string; username: string | undefined }

  @prop({ required: true, default: 0 })
  transCount!: number

  @prop({ required: true, default: 'en' })
  language!: string

  @prop({ required: true, default: 1 })
  chartId!: number

  @prop({ required: false, default: undefined })
  gif!: string | undefined
}

const TokenDataModel = getModelForClass(TokenData)

//find all pair by pairAddress
export function findAllTokenPairsByPairAddress(pairAddress: string) {
  return TokenDataModel.where('pairAddress').equals(pairAddress)
}

//get pair by id
export function getPairById(id: string) {
  return TokenDataModel.where('id').equals(id)
}

//if pair exits with pairid and chatId
export function pairExitsWithChatId(id: string, chatId: number) {
  return TokenDataModel.where('id')
    .equals(id)
    .where('chat.chatId')
    .equals(chatId)
}

//Add Token (pair) TO DB
export async function addToken(
  id: string,
  chain: { chainId: string; chainName: string; dexId: string },
  chat: { chatId: number; chatUsername: string | undefined; chatTitle: string },
  token0: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenSupply: number
    tokenDecimals: number
  },
  token1: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
  },
  pairAddress: string,
  emoji: string,
  emojiAmount: number,
  minBuy: number,
  addedBy: {
    id: number
    name: string
    username: string | undefined
  }
) {
  const Token = await TokenDataModel.where('pairAddress')
    .equals(pairAddress)
    .where('chat.chatId')
    .equals(chat.chatId)
    .limit(1)

  if (Token.length !== 0) return false

  return TokenDataModel.create({
    id,
    chain,
    chat,
    token0,
    token1,
    pairAddress,
    emoji,
    emojiAmount,
    minBuy,
    addedBy,
    gif: undefined,
  })
}

//Remove Token Pair
export async function removeTokenPairById(chatId: number, pairAddress: string) {
  const TokenPair = (
    await TokenDataModel.where('chat.chatId')
      .equals(chatId)
      .where('pairAddress')
      .equals(pairAddress)
      .limit(1)
  )[0]
  if (!TokenPair) return false
  return TokenPair.deleteOne()
}

//Active-Pause Any Pair Buys Alerts
export async function activeToken(tokenAddress: string, active: boolean) {
  const Token = (
    await TokenDataModel.where('pairAddress').equals(tokenAddress).limit(1)
  )[0]

  Token.isActive = active
  return Token.save()
}

//get all active tokens
export function getAllActiveTokens() {
  return TokenDataModel.find({ isActive: true })
}

//Change  A Pair Token0 Total/Circulating Supply
export async function changeTotalSupply(
  chatId: number,
  pairAddress: string,
  totalSupply: number
) {
  const pairData = (
    await TokenDataModel.where('pairAddress')
      .equals(pairAddress)
      .where('chat.chatId')
      .equals(chatId)
      .limit(1)
  )[0]

  if (!pairData) return false
  pairData.token0.tokenSupply = totalSupply
  return pairData.save()
}

//increase transCount
export async function increaseTransCount(chatId: number, pairAddress: string) {
  const pairData = (
    await TokenDataModel.where('pairAddress')
      .equals(pairAddress)
      .where('chat.chatId')
      .equals(chatId)
      .limit(1)
  )[0]

  if (!pairData) return false
  pairData.transCount += 1
  return pairData.save()
}

//Change Emoji For Trade Of Pair
export async function changeEmoji(
  chatId: number,
  pairAddress: string,
  emoji: string
) {
  const Token = (
    await TokenDataModel.where('pairAddress')
      .equals(pairAddress)
      .where('chat.chatId')
      .equals(chatId)
      .limit(1)
  )[0]

  if (!Token) return false
  Token.emoji = emoji
  return Token.save()
}

//Change Emoji Amount x(number) Emoji For X Amount Of Trade
export async function changeEmojiAmount(
  tokenAddress: string,
  emojiAmount: number
) {
  const Token = (
    await TokenDataModel.where('pairAddress').equals(tokenAddress).limit(1)
  )[0]

  Token.emojiAmount = emojiAmount
  return Token.save()
}

//Change Minium Buy Amount For Token Buys
export async function changeMinBuy(tokenAddress: string, minBuy: number) {
  const Token = (
    await TokenDataModel.where('pairAddress').equals(tokenAddress).limit(1)
  )[0]

  Token.minBuy = minBuy
  return Token.save()
}

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: { timestamps: true },
})
export class pairCount {
  @prop({ required: true, index: true, unique: true })
  id!: string

  @prop({ required: true })
  chain!: { chainId: 'eth' | 'bsc' | 'twit'; chainName: string; dexId: string }

  @prop({ required: true })
  token0!: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenSupply: number
    tokenDecimals: number
  }

  @prop({ required: true })
  token1!: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
  }

  @prop({ required: true, default: 0 })
  tokenPrice!: number

  @prop({ required: true })
  pairSwitched!: boolean

  @prop({ required: true, default: 0 })
  count!: number
}

const pairModel = getModelForClass(pairCount)

//function to check if pair exits in DB
export async function checkPairExist(pairAddress: string) {
  const pair = await pairModel.where('id').equals(pairAddress)
  if (pair.length === 0) return false
  else return true
}

//remove pair by pairAddress
export async function removePairByPairAddress(pairAddress: string) {
  const pair = await pairModel.where('id').equals(pairAddress)
  if (pair.length === 0) return false
  else return pair[0].deleteOne()
}

//function to get all pair from pairModel
export async function getAllPair() {
  const pair = await pairModel.where('count').gt(0)
  if (pair.length === 0) return false
  else return pair
}

//change reserve of pair
export async function changetokenPrice(
  pairAddress: string,
  tokenPrice: number
) {
  const pair = await pairModel.where('id').equals(pairAddress)
  if (pair.length === 0) return false
  else {
    pair[0].tokenPrice = tokenPrice
    return pair[0].save()
  }
}

//function to add pair from pairModel params id(pairAddress) and save to DB
export async function createPair(
  chain: { chainId: string; chainName: string; dexId: string },
  pairAddress: string,
  token0: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenSupply: number
    tokenDecimals: number
  },
  token1: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
  },

  pairSwitched: boolean
) {
  const Pair = await pairModel.where('id').equals(pairAddress).limit(1)
  if (Pair.length !== 0) return false

  return pairModel.create({
    chain,
    id: pairAddress,
    token0,
    token1,
    pairSwitched,
    count: 1,
  })
}

//function increase pair count by 1 and save to DB
export async function increasePairCount(pairAddress: string, count: number) {
  const Pair = await pairModel.where('id').equals(pairAddress).limit(1)
  if (Pair.length === 0) return false

  Pair[0].count = Pair[0].count + count
  return Pair[0].save()
}

//function to decrease pair count by 1 and save to DB
export async function decreasePairCount(pairAddress: string) {
  const Pair = await pairModel.where('id').equals(pairAddress).limit(1)
  if (Pair.length === 0) return false

  Pair[0].count = Pair[0].count - 1
  return Pair[0].save()
}
