## dCompass

A gamified and community driven Web3 learning platform.

# Tech stack overview

We are using Next.js & TypeScript for our front-end. Ceramic for our main data store in conjunction with Filecoin & IPFS for file storage.

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)
Accounts and API keys for [NFT.storage](https://nft.storage/) and [WEB3.storage](https://web3.storage/)

> 1. In each package individually, create your .env files by copying the .example.env
>    and fill in the empty values.

```sh
cd packages/[dapp, hardhat and schemas]
cp .exemple.env .env
```

Go to https://web3.storage and set the value of WEB3STORAGE_TOKEN with your web3.storage API key.

> 1. clone dCompass:

```bash
  git clone https://github.com/Discovery-Labs/dCompass.git
```

> 2. install dependencies

```bash
cd dCompass && yarn install
```

> 3. 👷‍ run hardhat locally and 🛰 deploy your contract

```bash
yarn chain
yarn deploy --network localhost --reset
```

> 4. publish your ceramic schemas

```bash
cd packages/schemas
yarn build
```

> 5. Start the 📱 dApp:

```bash
cd packages/dapp
yarn dev
```

> 5'. Start the 📱 landing page:
> (Optional, doesn't need anything else to run)

```bash
cd packages/web
yarn dev
```

## Folder structure

.
├── packages # Monorepo using yarn workspaces & lerna
│ ├── web # Landing page https://www.dcompass.discovery-dao.xyz/
│ ├── schemas # Ceramic and JSON schemas
│ ├── dapp # Web3 app for the projects, quests, etc
│ └── server # Will contain a centralised NodeJS server storing data on a Ceramic instance with a private key
└── ... config ...
