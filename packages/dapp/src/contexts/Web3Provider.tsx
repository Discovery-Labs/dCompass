import ABIS from "@discovery-dao/hardhat/abis.json";
import {
  PathwayNFT,
  ProjectNFT,
  SponsorPassSFT,
  BadgeNFT,
} from "@discovery-dao/hardhat/typechain-types";
import publishedModel from "@discovery-dao/schemas/lib/model.json";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { SiweMessage } from "siwe";

import { ethers } from "ethers";
import { useReducer, useEffect, useCallback, useMemo } from "react";
import Web3Modal from "web3modal";

import { ceramicCoreFactory, CERAMIC_TESTNET } from "../core/ceramic";
import { IdentityLink } from "../core/ceramic/identity-link";
import { NETWORK_URLS } from "../core/connectors";
import { ALL_SUPPORTED_CHAIN_IDS } from "../core/connectors/chains";
import getLibrary from "../core/connectors/getLibrary";
import {
  SignatureType,
  useGetNonceLazyQuery,
  useMeLazyQuery,
  useSignInMutation,
  useSignOutMutation,
} from "../core/graphql/generated/types";
import { useActiveWeb3React } from "../core/hooks/web3";
import { defaultChain, getStaticProvider, NETWORKS } from "../core/networks";

import { initialState, Web3Context } from "./Web3Context";
import { Web3Reducer } from "./Web3Reducer";
import { useContract, useNetwork } from "wagmi";

export const supportedNetworks = Object.keys(ABIS);

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

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
      infuraId: INFURA_ID,
    },
  },
};

const Web3Provider = ({ children }: { children: any }) => {
  const { activeChain } = useNetwork();

  const staticProvider = useMemo(
    () => getStaticProvider(activeChain),
    [activeChain]
  );

  const abiForCurrentNetwork =
    ABIS[defaultChain.id][NETWORKS[defaultChain.id].name];

  const PathwayNFTContractRead = useContract({
    addressOrName: abiForCurrentNetwork.contracts.PathwayNFT.address,
    contractInterface: abiForCurrentNetwork.contracts.PathwayNFT.abi,
    signerOrProvider: staticProvider,
  }) as PathwayNFT;
  const ProjectNFTContractRead = useContract({
    addressOrName: abiForCurrentNetwork.contracts.ProjectNFT.address,
    contractInterface: abiForCurrentNetwork.contracts.ProjectNFT.abi,
    signerOrProvider: staticProvider,
  }) as ProjectNFT;
  const SponsorPassSFTContractRead = useContract({
    addressOrName: abiForCurrentNetwork.contracts.SponsorPassSFT.address,
    contractInterface: abiForCurrentNetwork.contracts.SponsorPassSFT.abi,
    signerOrProvider: staticProvider,
  }) as SponsorPassSFT;
  const BadgeNFTContractRead = useContract({
    addressOrName: abiForCurrentNetwork.contracts.BadgeNFT.address,
    contractInterface: abiForCurrentNetwork.contracts.BadgeNFT.abi,
    signerOrProvider: staticProvider,
  }) as BadgeNFT;

  const [signIn] = useSignInMutation({
    fetchPolicy: "network-only",
  });
  const [signOut] = useSignOutMutation({
    fetchPolicy: "network-only",
  });
  const [getNonce] = useGetNonceLazyQuery({
    fetchPolicy: "network-only",
  });
  const [me] = useMeLazyQuery({
    fetchPolicy: "network-only",
  });
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const { activate, chainId, library } = useWeb3React();
  const { active, account } = useActiveWeb3React();
  const web3Modal = useMemo<Web3Modal>(
    () =>
      new Web3Modal({
        providerOptions,
        cacheProvider: true,
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

  const setIsSignedIn = (isSignedIn: boolean) => {
    dispatch({
      type: "SET_IS_SIGNED_IN",
      payload: isSignedIn,
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

  const logout = async () => {
    await signOut();
    setAccount(null);
    setSelf(null);
    setCore(null);
    setIsReviewer(false);
    setContracts({
      projectNFTContract: ProjectNFTContractRead,
      pathwayNFTContract: PathwayNFTContractRead,
      SponsorPassSFT: SponsorPassSFTContractRead,
      BadgeNFT: BadgeNFTContractRead,
    });
    setIsSignedIn(false);
    // TODO: better way to handle this ? https://github.com/NoahZinsmeister/web3-react/issues/228
    localStorage.setItem("defaultWallet", "");
  };

  useEffect(() => {
    const coreCeramic = ceramicCoreFactory();
    setCore(coreCeramic);
  }, []);

  useEffect(() => {
    async function initReadContracts() {
      setContracts({
        projectNFTContract: ProjectNFTContractRead,
        pathwayNFTContract: PathwayNFTContractRead,
        SponsorPassSFT: SponsorPassSFTContractRead,
        BadgeNFT: BadgeNFTContractRead,
      });
    }
    initReadContracts();
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
          const SponsorPassSFT = new ethers.Contract(
            abis[strChainId][network.name].contracts.SponsorPassSFT.address,
            abis[strChainId][network.name].contracts.SponsorPassSFT.abi,
            signer
          );
          const BadgeNFT = new ethers.Contract(
            abis[strChainId][network.name].contracts.BadgeNFT.address,
            abis[strChainId][network.name].contracts.BadgeNFT.abi,
            signer
          );
          setContracts({
            projectNFTContract,
            pathwayNFTContract,
            SponsorPassSFT,
            BadgeNFT,
          });
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
        console.log({ active, account });
        setAccount(account);
        const ethersProvider = new ethers.providers.Web3Provider(
          library.provider,
          "any"
        );

        const mySelf = await SelfID.authenticate({
          authProvider: new EthereumAuthProvider(
            ethersProvider.provider,
            account
          ),
          ceramic: CERAMIC_TESTNET,
          connectNetwork: CERAMIC_TESTNET,
          aliases: publishedModel,
        });
        setSelf(mySelf);
        const identityLinkService = new IdentityLink(
          process.env.NEXT_PUBLIC_CERAMIC_VERIFICATION_SERVER_URL ||
            "https://verifications-clay.3boxlabs.com"
        );
        setIdentityLink(identityLinkService);

        try {
          const { data: meData } = await me();
          console.log({ me: meData?.me });
          if (!meData?.me?.id) {
            // Get a nonce from the back-end
            const { data } = await getNonce();
            console.log({ nonce: data?.getNonce });
            if (!data?.getNonce) {
              throw new Error("No nonce");
            }
            const message = new SiweMessage({
              domain: window.document.location.host,
              address: account,
              chainId: await library
                .getNetwork()
                .then(({ chainId }: { chainId: number }) => chainId),
              uri: window.document.location.origin,
              version: "1",
              statement: "Howdy Adventurer!",
              nonce: data?.getNonce,
            });

            console.log({ message });

            const signature = await library
              .getSigner()
              .signMessage(message.prepareMessage());

            console.log({ signature });

            const isSignedIn = await signIn({
              variables: {
                input: {
                  message: {
                    ...message,
                    statement: message.statement || "Howdy Adventurer!",
                    type: SignatureType.PersonalSignature,
                    signature,
                  },
                },
              },
            });
            console.log(isSignedIn.data);
            setIsSignedIn(true);
          }
          // setAccount(meData.me.address);
          // setENS(meData.me.ens);
        } catch (error) {
          console.log("NOT_AUTHENTICATED");
          try {
            // Get a nonce from the back-end
            const { data } = await getNonce();
            console.log({ nonce: data?.getNonce });
            if (!data?.getNonce) {
              throw new Error("No nonce");
            }
            const message = new SiweMessage({
              domain: window.document.location.host,
              address: account,
              chainId: await library
                .getNetwork()
                .then(({ chainId }: { chainId: number }) => chainId),
              uri: window.document.location.origin,
              version: "1",
              statement: "Howdy Adventurer!",
              nonce: data?.getNonce,
            });

            console.log({ message });

            const signature = await library
              .getSigner()
              .signMessage(message.prepareMessage());

            console.log({ signature });

            const isSignedIn = await signIn({
              variables: {
                input: {
                  message: {
                    ...message,
                    statement: message.statement || "Howdy Adventurer!",
                    type: SignatureType.PersonalSignature,
                    signature,
                  },
                },
              },
            });
            console.log(isSignedIn.data);
            setIsSignedIn(true);
          } catch (error) {
            setIsSignedIn(false);
            console.log(error);
          }
        }

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
  }, [account, me, active, signIn, getNonce, library, web3Modal]);

  const connectWeb3 = useCallback(async () => {
    const provider = await web3Modal.connect();
    const lib = getLibrary(provider);
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
        const SponsorPassSFT = new ethers.Contract(
          abis[strChainId][network.name].contracts.SponsorPassSFT.address,
          abis[strChainId][network.name].contracts.SponsorPassSFT.abi,
          signer
        );
        const AppDiamond = new ethers.Contract(
          abis[strChainId][network.name].contracts.AppDiamond.address,
          abis[strChainId][network.name].contracts.AppDiamond.abi,
          signer
        );
        const BadgeNFT = new ethers.Contract(
          abis[strChainId][network.name].contracts.BadgeNFT.address,
          abis[strChainId][network.name].contracts.BadgeNFT.abi,
          signer
        );
        const AdventurerNFT = new ethers.Contract(
          abis[strChainId][network.name].contracts.AdventurerNFT.address,
          abis[strChainId][network.name].contracts.AdventurerNFT.abi,
          signer
        );
        setContracts({
          projectNFTContract,
          pathwayNFTContract,
          SponsorPassSFT,
          AppDiamond,
          BadgeNFT,
          AdventurerNFT,
        });
        const isValidReviewer = await projectNFTContract.reviewers(
          connectedAccount
        );
        setIsReviewer(isValidReviewer);
      }
    }

    setAccount(connectedAccount);

    // Sign in with ethereum
    try {
      // Get a nonce from the back-end
      const { data } = await getNonce();
      console.log({ nonce: data?.getNonce });
      if (!account || !data?.getNonce) {
        throw new Error("No nonce or account");
      }
      const message = new SiweMessage({
        domain: window.document.location.host,
        address: connectedAccount,
        chainId: await lib
          .getNetwork()
          .then(({ chainId }: { chainId: number }) => chainId),
        uri: window.document.location.origin,
        version: "1",
        statement: "Howdy Adventurer!",
        nonce: data?.getNonce,
      });

      console.log({ message });

      const signature = await lib
        .getSigner()
        .signMessage(message.prepareMessage());

      console.log({ signature });

      const isSignedIn = await signIn({
        variables: {
          input: {
            message: {
              ...message,
              statement: message.statement || "Howdy Adventurer!",
              type: SignatureType.PersonalSignature,
              signature,
            },
          },
        },
      });
      console.log(isSignedIn.data);
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
      console.log(error);
    }

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
      aliases: publishedModel,
    });
    setSelf(mySelf);
  }, [chainId, activate, web3Modal, signIn, account, getNonce]);

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
