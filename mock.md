## How do Gitcoin grants work?

### Gitcoin's mission is to build & fund public goods

Our grants program, which runs for a two-week period every 3 months, connects builders & funders in Web3

Gitcoin grants is a three-sided marketplace:
💰 Matching Funders
💲 Individual Contributors
👩‍💻 Grantees

## 💰 Matching Funders

These are typically Web3 projects, like Uniswap or 0xPolygon, who generously commit large sums of capital (often $100K+) to our matching pools.

## 💲 Individual Contributors

These are ordinary people, like you and I, who might donate $5-10 (or much more!) towards a specific grant

## 👩‍💻 Grantees

These are early-stage builders - often open-source devs - who are seeking funding for their project

## What is Quadratic funding?

##### [Before diving in deeper, we suggest you to head over >>WTF IS QF?<< and play with the variables to understand the formula.](https://wtfisqf.com/?grant=&grant=&grant=&grant=&match=1000)

> The quadratic funding mechanism (QF) is a concrete proposal for turning your small donations into something much larger. It requires a simple formula to achieve this goal.

> Crowdfund individual donations towards open source projects (try to have the maximum of contributors, it's the number of participants that counts, not the amount of contribution). A match from governments, grant programs, or private philanthropists (offered by sponsors/donors for the grant's round fund).

## Why is Quadratic funding powerful?

The QF Mechanism measures the breadth of contributors, not the depth of contributions - which is a very democratic funding model.

QF pushes power to the edges of the network!

> Economist Glen Weyl has called QF the "optimal way to fund public goods that a broad base of the population cares about".

---- IPFS ----

## What is IPFS ?

A peer-to-peer hypermedia protocol designed to preserve and grow humanity's knowledge by making the web upgradeable, resilient, and more open.

## The web of tomorrow needs IPFS today

> IPFS aims to surpass HTTP in order to build a better web for all of us.

## How IPFS works ?

When you add a file to IPFS, your file is split into smaller chunks, cryptographically hashed, and given a **unique fingerprint** called a **content identifier (CID)**. This CID acts as an permanent record of your file as it exists at that point in time.

When other nodes **look up your file**, they ask their peer nodes who's storing the content referenced by the file's CID. When they view or download your file, they cache a copy — and become another provider of your content until their cache is cleared.

A node can pin content in order to keep (and provide) it forever, or discard content it hasn't used in a while to save space. This means each node in the network **stores only content it is interested in**, plus some indexing information that helps figure out which node is storing what.

If you add a new version of your file to IPFS, its cryptographic hash is different, and so it gets a new CID. This means **files stored on IPFS are resistant to tampering and censorship** — any changes to a file don't overwrite the original, and common chunks across files can be reused in order to minimize storage costs.

However, this doesn't mean you need to remember a long string of CIDs — IPFS can find the latest version of your file using the IPNS decentralized naming system, and DNSLink can be used to map CIDs to **human-readable DNS names**.
----CERAMIC-----

## **Why Self.ID?**

---

**✅ Easy setup**

Self.ID is a simple SDK requiring minimal configuration that provides access to the full Ceramic stack with support for popular environments such as `React` and `web`. The Self.ID SDK uses [Glaze suite](https://github.com/ceramicnetwork/docs/blob/main/docs/reference/glaze/index.md) middleware, [3ID DID](https://github.com/ceramicnetwork/docs/blob/main/docs/docs/advanced/standards/accounts/3id-did.md) accounts, [3ID Connect](https://github.com/ceramicnetwork/docs/blob/main/docs/reference/accounts/3id-did.md#3id-connect) authentication, and [Ceramic HTTP client](https://github.com/ceramicnetwork/docs/blob/main/docs/reference/core-clients/ceramic-http.md) and [DID JSON-RPC client](https://github.com/ceramicnetwork/docs/blob/main/docs/reference/core-clients/did-jsonrpc.md).

**✅ Login with Web3**

Self.ID is compatible with Ethereum accounts and EVM-based wallet authentication, so users don't have to install new wallets or create new accounts in order to use Ceramic. Users can even connect multiple wallet accounts to their Ceramic account, if they like.

**✅ Composable, user-centric data management**

The SDK includes some of the most popular Ceramic data models out-of-the-box, such as [user profiles](https://github.com/ceramicstudio/datamodels/tree/main/models/identity-profile-basic), linked [crypto accounts](https://github.com/ceramicstudio/datamodels/tree/main/models/identity-accounts-crypto), and linked [Web2 accounts](https://github.com/ceramicstudio/datamodels/tree/main/models/identity-accounts-web), giving your application automatic storage and retrieval composability with a rich set of existing users and data to bootstrap your application.

**✅ Extensible data models**

You're not limited to just the data models provided by Self.ID! You can create new data models or import ones from the [Data Models Registry](https://github.com/ceramicstudio/datamodels) to add additional data features to your application.

## **Building with React**

---

### [**Using the Framework →**](https://github.com/ceramicnetwork/docs/blob/main/docs/tools/self-id/framework.md)

The Framework is the highest-level abstraction provided by the Self.ID SDK, designed specifically to power [React](https://reactjs.org/) applications. It leverages most other packages of the Self.ID SDK, and in most cases is the module you should use if you're building with React.

<!-- ### [**Using the React module →**]()

The React module is used by the Framework module and provides React-specific components, hooks, and utility functions to help manage user authentication, data storage, and retrieval. Unless you have a specific reason to use this React module, you should consider using the Framework instead. -->

## **Building with JavaScript**

---

### [**Using the Web module →**](https://github.com/ceramicnetwork/docs/blob/main/docs/tools/self-id/write.md)

The Web module provides user authentication, data storage, and retrieval for browser-based applications.

### [**Using the Core module →**](https://github.com/ceramicnetwork/docs/blob/main/docs/tools/self-id/read.md)

The Core module only provides data retrieval for Node and browser-based applications.

--- FILECOIN ----

### Store your data using our simple API.

#### It’s fast, open, and it’s free.

### Store and retrieve with ease

Most decentralized storage services either need you to jump through hoops (like buying some cryptocurrency) or aren't truly decentralized.

With Web3.Storage, things are both easy-to-use and trustless! Upload any data via our API or our web UI for free. The data will end up on a decentralized set of IPFS and Filecoin storage providers.

### Why Web3.Storage?

With Web3.Storage you get all the benefits of decentralized storage technologies with the frictionless experience you expect in a modern dev workflow.

> #### [READ THE DOCS](https://web3.storage/docs/)

#### Simple

With Web3.Storage, you get decentralized storage in minutes. Use our simple client library or the HTTP API directly - all you need is a free API token.

#### Open

All data stored is accessible on the public IPFS network via a content ID - interoperable with the tools and services building on the decentralized web.

#### Free

Data is stored on the Filecoin network, which has a unique economic model and over 15 EiB of capacity, allowing us to offer Web3.Storage for free today. This storage is cryptographically provable by anyone!

--- SELF ID BOUNTY ----

> ##### `@self.id/framework` the highest-level abstraction provided by the Self.ID SDK, designed to easily power React applications with React components, hooks, and utility functions for user authentication, data storage, and retrieval.

### 📖 Quest external resources

- [🔗 Official docs ](https://developers.ceramic.network/tools/self-id/framework/)
- [🔗 Github repo](https://github.com/ceramicstudio/self.id)

### ✅ Quest success criterias

- Should include a link to a working application using `@self.id/framework` (even on a dev or staging environment, using testnet networks)
- Should include a link to the Github repo used for the deployed application
- Should include feedback on the developer experience (minimum 200 words)

---- CERAMIC CHALLENGE SOLUTION -----

## [Link to working app](https://alpha.dcompass.xyz)

## [Link to github repo](https://github.com/Discovery-Labs/dCompass)

## Feedback on the developer experience

- I had some issues trying to login on mobile using the Argent and Rainbow wallets
- I had also issues when switching between wallets that had 2 different DIDs, I had to give a page refresh for a proper DID change
- It was great to integrate the Github and Twitter account linking
