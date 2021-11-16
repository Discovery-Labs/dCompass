import ABIS from "@discovery-dao/hardhat/abis.json";
import publishedModel from "@discovery-dao/schemas/lib/model.json";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import Authereum from "authereum";
import { ethers } from "ethers";
import React, { createContext, useReducer, useEffect } from "react";
import Web3Modal from "web3modal";

import { ceramicCoreFactory, CERAMIC_TESTNET } from "../core/ceramic";

import { State, Web3Reducer } from "./Web3Reducer";

const { NEXT_PUBLIC_INFURA_ID } = process.env;

const rpcs = {
  1: `https://mainnet.infura.io/v3/${NEXT_PUBLIC_INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
  42: `https://kovan.infura.io/v3/${NEXT_PUBLIC_INFURA_ID}`,
  80001: `https://polygon-mumbai.infura.io/v3/${NEXT_PUBLIC_INFURA_ID}`,
  100: "https://dai.poa.network", // xDai
};
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

// TODO: create custom ceramic auth for wallet connect?
const walletconnect = new WalletConnectConnector({
  rpc: rpcs,
  qrcode: true,
});

const initialState = {
  loading: false,
  account: null,
  provider: null,
} as State;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      bridge: "https://polygon.bridge.walletconnect.org",
      infuraId: NEXT_PUBLIC_INFURA_ID,
      rpc: rpcs,
    },
  },
  // authereum: {
  //   package: Authereum,
  // },
};
const Web3Context = createContext(initialState);

const Web3Provider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);
  const { activate } = useWeb3React();
  const setAccount = (account: null | string) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setProvider = (provider: null | any) => {
    activate(provider.connection.url === "metamask" ? injected : walletconnect);
    dispatch({
      type: "SET_PROVIDER",
      payload: provider,
    });
  };

  const setSelf = (self: null | any) => {
    dispatch({
      type: "SET_SELF",
      payload: self,
    });
  };

  const setCore = (core: null | any) => {
    dispatch({
      type: "SET_CORE",
      payload: core,
    });
  };

  useEffect(() => {
    const coreCeramic = ceramicCoreFactory();
    setCore(coreCeramic);
  }, []);

  const logout = async () => {
    setAccount(null);
    setProvider(null);
    setSelf(null);
    setCore(null);
    localStorage.setItem("defaultWallet", "");
  };

  const connectWeb3 = async () => {
    const web3Modal = new Web3Modal({
      providerOptions,
      cacheProvider: false,
    });
    const provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    setProvider(ethersProvider);
    const signer = ethersProvider.getSigner();
    const account = await signer.getAddress();
    setAccount(account);

    const mySelf = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(ethersProvider.provider, account),
      ceramic: CERAMIC_TESTNET,
      connectNetwork: CERAMIC_TESTNET,
      model: publishedModel,
    });
    setSelf(mySelf);

    provider.on("chainChanged", () => {
      // window.location.reload();
    });

    provider.on("accountsChanged", () => {
      // window.location.reload();
    });
  };

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connectWeb3,
        logout,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context, Web3Provider };
