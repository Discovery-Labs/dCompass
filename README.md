# dCompass

A gamified and community driven Web3 learning platform.

## Tech stack overview

We are using TypeScript with Next.js on the front-end, and NestJS on the back-end.
Ceramic is our main data store in conjunction with Filecoin & IPFS for file storage.

### 📁 Folder structure

```
.
├── packages # Monorepo using yarn workspaces & lerna
│ ├── web # Landing page https://www.dcompass.discovery-dao.xyz/
│ ├── schemas # Ceramic and JSON schemas
│ ├── dapp # Web3 app for the projects, quests, etc
│ └── server # Will contain a centralised NodeJS server storing data on a Ceramic instance with a private key
└── ... config ...
```

## 🏄‍♂️ Quick Start

### Prerequisites

- [Node](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)
- Accounts and API keys for [NFT.storage](https://nft.storage/) and [WEB3.storage](https://web3.storage/)

### Setup env

In each package individually, create your `.env` files by copying the `.example.env` and fill in the empty values.

```sh
$ cd packages/[dapp, hardhat and schemas]
$ cp .example.env .env
```

### Create API Key

Go to https://web3.storage and set the value of WEB3STORAGE_TOKEN with your web3.storage API key.

### Clone dCompass

```sh
$ git clone https://github.com/Discovery-Labs/dCompass.git
```

### install dependencies

```sh
$ cd dCompass && yarn install
```

### 🏺‍ Publish your Ceramic schemas

```sh
$ cd packages/schemas
$ yarn build
```

### 🛰 Run the backend

```sh
$ cd packages/server && yarn start:dev
```

### 👷‍ Build it!

run hardhat locally, get some faucet and 🛰 deploy your contract
Set one of your addresses as the DEV_ADDRESS as well as a dev hot wallet private key as the DEPLOYER_PRIVATE_KEY environment variables in packages/hardhat/.env

```sh
$ cd packages/hardhat
$ yarn chain
$ yarn faucet <YOUR_DEV_ADDRESS>

Deploying on localhost
$ yarn deploy --network localhost --reset

Deploying on mumbai
$ yarn deploy --network mumbai --reset

Deploying on an other testnet (make sure to edit the hardhat.config.js first)
$ yarn deploy --network mytestnet --reset
```

#### Testnet Faucets

- [Kovan](https://faucets.chain.link/kovan)
- [Mumbai](https://faucet.polygon.technology/)
- [Rinkeby](https://faucet.rinkeby.io/)
- [BSC](https://testnet.binance.org/faucet-smart)

### Dev Preview

**Start the 📱 dApp:**

```bash
$ cd packages/dapp
$ yarn dev
```

**Start the 📱 landing page:**

> (Optional, doesn't need anything else to run)

```sh
$ cd packages/web
$ yarn dev
```
