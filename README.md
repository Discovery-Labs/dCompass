# dCompass

A gamified and community driven Web3 learning platform.

## Tech stack overview

We are using Next.js & TypeScript for our front-end. Ceramic for our main data store in conjunction with Filecoin & IPFS for file storage.

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

### 🛰 Run the backend

```sh
$ cd packages/backend && yarn start:dev
```

### 👷‍ Build it!

run hardhat locally and 🛰 deploy your contract

```sh
$ yarn chain
$ yarn accounts
// set one of the addresses as the DEPLOYER_ADDRESS environment variable in packages/hardhat/.env
$ yarn deploy --network localhost --reset
```

### 👷‍ Publish your Ceramic schemas

```sh
$ cd packages/schemas
$ yarn build
```

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

## Folder structure

```
.
├── packages # Monorepo using yarn workspaces & lerna
│ ├── web # Landing page https://www.dcompass.discovery-dao.xyz/
│ ├── schemas # Ceramic and JSON schemas
│ ├── dapp # Web3 app for the projects, quests, etc
│ └── server # Will contain a centralised NodeJS server storing data on a Ceramic instance with a private key
└── ... config ...
```
