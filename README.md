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

### Clone dCompass

```sh
$ git clone https://github.com/Discovery-Labs/dCompass.git
```

### Setup env

In each package individually, create your `.env` files by copying the `.example.env` and fill in the empty values.

```sh
$ cd packages/[dapp, hardhat and schemas]
$ cp .example.env .env
```

### Create API Key

Go to https://web3.storage and set the value of WEB3STORAGE_TOKEN with your web3.storage API key. And paste them into your `.env` file on the `dapp` package.

### install dependencies

```sh
$ cd dCompass && yarn bootstrap
```

### 👷‍ Build it!

build the dCompass ui:

```sh
$ yarn workspace @discovery-decrypted/ui run build
```

publish your ceramic schemas

```sh
$ yarn workspace @discovery-decrypted/schemas build
```

### Dev Preview

**Start the 📱 dApp:**

```sh
$ yarn workspace @discovery-decrypted/dapp dev
```

open http://localhost:3000/ to preview the dCompass dApp.

**Start the 📱 landing page:**
> (Optional, doesn't need anything else to run)

```sh
$ yarn workspace @discovery-decrypted/web dev
```

open http://localhost:3001/ to preview the dCompass landing page.

## Folder structure

```
packages      # Monorepo using yarn workspaces & lerna
├── dapp      # Web3 app for the projects, quests, etc
├── hardhat   # Contract infrastructure for the dapp
├── schemas   # Ceramic and JSON schemas
├── server    # Will contain a centralised NodeJS server storing data on a Ceramic instance with a private key
├── ui        # Contain all the reuseable components for the dCompass UI
└── web       # Landing page https://www.dcompass.discovery-dao.xyz/
```
