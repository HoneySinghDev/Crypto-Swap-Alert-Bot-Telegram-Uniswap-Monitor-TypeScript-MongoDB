# 🚀 Crypto Swap Alert Bot - Open Source Edition 📈

> **A Telegram bot that monitors Uniswap pairs and sends styled alerts with emojis, token details, and custom media on swaps. Built with TypeScript, MongoDB, and grammY.**

🚧 **Disclaimer:** _This is a community-edition with Uniswap-only support. For multi-chain or commercial use, see the Advanced Version section below._

---

## 🛠 Built With

- **TypeScript**
- **MongoDB**
- **grammY framework**

---

## 🔑 Key Features

| Core Features ✅                                     | Advanced Version Features 🔥 (Paid Upgrade)      |
| ---------------------------------------------------- | ------------------------------------------------ |
| ✅ **/add ** - Track Uniswap pairs (Admins Only)     | 🔥 Multi-chain support (ETH, BSC, etc.)          |
| ✅ Real-time buy/sell alerts with emoji sequences    | 🔥 Multi-DEX monitoring (PancakeSwap, SushiSwap) |
| ✅ Token metadata display (symbol, supply, decimals) | 🔥 Dynamic ad integration                        |
| ✅ Customizable alert settings via **/settings**     | 🔥 Enhanced analytics dashboard                  |
| • Custom GIFs/images per alert                       | 🔥 Game mechanics integration                    |
| • Minimum buy amount filter                          | 🔥 Priority support & automatic updates          |
| • Emoji customization (default: 🟢)                  | 🔥 Commercial usage rights                       |
| • Buy step thresholds                                |                                                  |
| ✅ Multi-group administration support                |                                                  |
| ✅ Basic supply tracking (**/change_supply**)        |                                                  |

> **Disclaimer:** This is a community-edition with **Uniswap-only** support. For multi-chain or commercial use, see [Advanced Version](#upgrade) below.

---

## ⚙️ Technical Highlights

- ✅ Type-safe codebase with TypeScript
- ✅ MongoDB integration for:
  - Token pairs tracking
  - Group-specific configurations
  - Swap count analytics
- ✅ Middleware-powered command handlers
- ✅ Customizable alert templates
- ✅ Rate-limited administration controls

---

## 🛠 Detailed Setup Instructions

### 1. **MongoDB Configuration**:

- Sign up for MongoDB Atlas or set up your local MongoDB server.
- Create a new database and note the connection string (URI).

### 2. **Environment Variables**:

Create a `.env` file from `.env.sample` and ensure all these variables are provided:

```env
BOT_TOKEN="<Your Telegram Bot Token>"
MONGO="<Your MongoDB Connection URI>"
HTTP_URL_eth="<Ethereum Node HTTP URL>"
WSS_URL_eth="<Ethereum Node WebSocket URL>"
HTTP_URL_bsc="<Binance Smart Chain HTTP URL>"
WSS_URL_bsc="<Binance Smart Chain WebSocket URL>"
HTTP_URL_twitter="<Twitter API URL if applicable>"
ADMIN_IDS="<Telegram Admin IDs separated by commas>"
RAILWAY_STATIC_URL="<Railway or your hosting static URL for webhooks>"
```

### 3. **Install Dependencies**:

```bash
npm install
```

### 4. **Deployment**:

Build and start your bot:

```bash
npm run build
npm run start
```

Your bot should now be running and connected to Telegram!

---

## 🌟 Need More Power? Get the Enterprise Edition!

| Features               | Open Source 🌱 | Pro 🔥 |
| ---------------------- | -------------- | ------ |
| Multi-chain support    | ❌             | ✅     |
| Multi-DEX monitoring   | ❌             | ✅     |
| Dynamic ad integration | ❌             | ✅     |
| Advanced analytics     | ❌             | ✅     |
| Game integration       | ❌             | ✅     |
| Priority support       | ❌             | ✅     |

and more...

📲 **Contact:**

- Telegram Group: [@TheNoobDeveloper](https://t.me/TheNoobDeveloper)
- Direct Message: [@ronnekeren](https://t.me/ronnekeren)

---

## 📌 Keywords

Telegram Crypto Bot, Uniswap Alerts, TypeScript Bot, Swap Monitor, Open Source Crypto Tool, MongoDB Telegram Integration
