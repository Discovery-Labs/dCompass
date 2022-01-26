import ABIS from "@discovery-dao/hardhat/abis.json";
import publishedModel from "@discovery-dao/schemas/lib/model.json";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import Authereum from "authereum";
import { ethers } from "ethers";
import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import Web3Modal from "web3modal";

import { ceramicCoreFactory, CERAMIC_TESTNET } from "../core/ceramic";
import { IdentityLink } from "../core/ceramic/identity-link";
import { NETWORK_URLS } from "../core/connectors";
import { ALL_SUPPORTED_CHAIN_IDS } from "../core/connectors/chains";
import { useActiveWeb3React } from "../core/hooks/web3";
import NETWORKS from "../core/networks";

import { initialState, Web3Context } from "./Web3Context";
import { Web3Reducer } from "./Web3Reducer";

export const supportedNetworks = Object.keys(ABIS);

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworks.map((net) => parseInt(net, 10)),
});

const walletconnect = new WalletConnectConnector({
  rpc: NETWORK_URLS,
  qrcode: true,
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
      rpcs: NETWORK_URLS,
      qrcode: true,
    },
  },
  // authereum: {
  //   package: Authereum,
  // },
};

const Web3Provider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);
  const { activate, chainId, library } = useWeb3React();
  const { active, account } = useActiveWeb3React();
  const web3Modal = useMemo<Web3Modal>(
    () =>
      new Web3Modal({
        providerOptions,
        cacheProvider: false,
      }),
    []
  );

  const setAccount = (walletAddress: null | string) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: walletAddress,
    });
  };

  const setENS = (ens: null | string) => {
    dispatch({
      type: "SET_ENS",
      payload: ens,
    });
  };

  const setIsReviewer = (isReviewer: boolean) => {
    dispatch({
      type: "SET_IS_REVIEWER",
      payload: isReviewer,
    });
  };

  const setSelf = (self: null | any) => {
    dispatch({
      type: "SET_SELF",
      payload: self,
    });
  };

  const setContracts = (contracts: null | any) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const setCore = (core: null | any) => {
    dispatch({
      type: "SET_CORE",
      payload: core,
    });
  };

  const setIdentityLink = (identityLink: null | any) => {
    dispatch({
      type: "SET_IDENTITY_LINK",
      payload: identityLink,
    });
  };

  useEffect(() => {
    const coreCeramic = ceramicCoreFactory();
    setCore(coreCeramic);
  }, []);

  useEffect(() => {
    async function updateState() {
      if (chainId && library) {
        const strChainId = chainId?.toString();
        if (supportedNetworks.includes(strChainId)) {
          const provider = await web3Modal.connect();
          const network = NETWORKS[strChainId as keyof typeof NETWORKS];
          const abis = ABIS as Record<string, any>;
          const lib = new ethers.providers.Web3Provider(provider);
          const signer = lib.getSigner();
          const projectNFTContract = new ethers.Contract(
            abis[strChainId][network.name].contracts.ProjectNFT.address,
            abis[strChainId][network.name].contracts.ProjectNFT.abi,
            signer
          );
          const pathwayNFTContract = new ethers.Contract(
            abis[strChainId][network.name].contracts.PathwayNFT.address,
            abis[strChainId][network.name].contracts.PathwayNFT.abi,
            signer
          );
          setContracts({ projectNFTContract, pathwayNFTContract });
          const isValidReviewer = await projectNFTContract.reviewers(account);
          setIsReviewer(isValidReviewer);
        }
      }
    }
    updateState();
  }, [chainId, library, account, web3Modal]);

  useEffect(() => {
    async function handleActiveAccount() {
      if (active && account) {
        setAccount(account);

        const provider = await web3Modal.connect();
        const mySelf = await SelfID.authenticate({
          authProvider: new EthereumAuthProvider(provider, account),
          ceramic: CERAMIC_TESTNET,
          connectNetwork: CERAMIC_TESTNET,
          model: publishedModel,
        });
        setSelf(mySelf);
        // Get ens
        let ens = null;
        try {
          ens = await library.lookupAddress(account);
          setENS(ens);
        } catch (error) {
          console.log({ error });
          setENS(null);
        }
      }
    }
    handleActiveAccount();
    return () => {
      setAccount(null);
      setENS(null);
    };
  }, [account, active, library, web3Modal]);

  const logout = async () => {
    setAccount(null);
    setSelf(null);
    setCore(null);
    setIsReviewer(false);
    setContracts(null);
    // TODO: better way to handle this ? https://github.com/NoahZinsmeister/web3-react/issues/228
    localStorage.setItem("defaultWallet", "");
  };

  const connectWeb3 = useCallback(async () => {
    const provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider, "any");
    activate(
      ethersProvider.connection.url === "metamask" ? injected : walletconnect
    );
    const signer = ethersProvider.getSigner();
    const connectedAccount = await signer.getAddress();
    if (chainId) {
      const strChainId = chainId.toString() as keyof typeof NETWORKS;
      if (supportedNetworks.includes(strChainId)) {
        const network = NETWORKS[strChainId];
        const abis = ABIS as Record<string, any>;
        const projectNFTContract = new ethers.Contract(
          abis[strChainId][network.name].contracts.ProjectNFT.address,
          abis[strChainId][network.name].contracts.ProjectNFT.abi,
          signer
        );
        const pathwayNFTContract = new ethers.Contract(
          abis[strChainId][network.name].contracts.PathwayNFT.address,
          abis[strChainId][network.name].contracts.PathwayNFT.abi,
          signer
        );
        setContracts({ projectNFTContract, pathwayNFTContract });
        const isValidReviewer = await projectNFTContract.reviewers(
          connectedAccount
        );
        setIsReviewer(isValidReviewer);
      }
    }

    setAccount(connectedAccount);

    const identityLinkService = new IdentityLink(
      process.env.NEXT_PUBLIC_CERAMIC_VERIFICATION_SERVER_URL ||
      "https://verifications-clay.3boxlabs.com"
    );
    setIdentityLink(identityLinkService);

    const mySelf = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(
        ethersProvider.provider,
        connectedAccount
      ),
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
  }, [chainId, activate, web3Modal]);

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
