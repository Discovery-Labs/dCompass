/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface AppDiamondInterface extends utils.Interface {
  functions: {
    "addERC20PerChain(uint256,address[])": FunctionFragment;
    "addProjectERC20PerChain(string,uint256[],address[][])": FunctionFragment;
    "appSigningAddr()": FunctionFragment;
    "checkApprovedERC20PerProjectByChain(string,uint256,address)": FunctionFragment;
    "deployDiamond(string,bool,address,address,bytes32,bytes32,uint8)": FunctionFragment;
    "getERC20Addrs(uint256)": FunctionFragment;
    "getERC20AddrsPerProject(string,uint256)": FunctionFragment;
    "isERC20ApprovedOnChainId(uint256,address)": FunctionFragment;
    "isProjectERC20ApprovedOnChainId(string,uint256,address)": FunctionFragment;
    "multiSigThreshold()": FunctionFragment;
    "numReviewers()": FunctionFragment;
    "owner()": FunctionFragment;
    "projApproved(string)": FunctionFragment;
    "projectDiamondAddrs(string)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "reviewers(address)": FunctionFragment;
    "setApproved(string)": FunctionFragment;
    "setprojectNFTAddr(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addERC20PerChain"
      | "addProjectERC20PerChain"
      | "appSigningAddr"
      | "checkApprovedERC20PerProjectByChain"
      | "deployDiamond"
      | "getERC20Addrs"
      | "getERC20AddrsPerProject"
      | "isERC20ApprovedOnChainId"
      | "isProjectERC20ApprovedOnChainId"
      | "multiSigThreshold"
      | "numReviewers"
      | "owner"
      | "projApproved"
      | "projectDiamondAddrs"
      | "renounceOwnership"
      | "reviewers"
      | "setApproved"
      | "setprojectNFTAddr"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addERC20PerChain",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addProjectERC20PerChain",
    values: [string, BigNumberish[], string[][]]
  ): string;
  encodeFunctionData(
    functionFragment: "appSigningAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkApprovedERC20PerProjectByChain",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "deployDiamond",
    values: [
      string,
      boolean,
      string,
      string,
      BytesLike,
      BytesLike,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getERC20Addrs",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getERC20AddrsPerProject",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isERC20ApprovedOnChainId",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isProjectERC20ApprovedOnChainId",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "multiSigThreshold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numReviewers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "projApproved",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "projectDiamondAddrs",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "reviewers", values: [string]): string;
  encodeFunctionData(functionFragment: "setApproved", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setprojectNFTAddr",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addERC20PerChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addProjectERC20PerChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "appSigningAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkApprovedERC20PerProjectByChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployDiamond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getERC20Addrs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getERC20AddrsPerProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isERC20ApprovedOnChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isProjectERC20ApprovedOnChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "multiSigThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numReviewers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "projApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "projectDiamondAddrs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "reviewers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setprojectNFTAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface AppDiamond extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AppDiamondInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addERC20PerChain(
      chainId: BigNumberish,
      _ERC20Addrs: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addProjectERC20PerChain(
      projectId: string,
      chainIds: BigNumberish[],
      ERC20Addrs: string[][],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    appSigningAddr(overrides?: CallOverrides): Promise<[string]>;

    checkApprovedERC20PerProjectByChain(
      projectId: string,
      chainId: BigNumberish,
      ERC20Addr: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    deployDiamond(
      _projectId: string,
      appSign: boolean,
      projectSigningAddr: string,
      _diamondCutFacet: string,
      r: BytesLike,
      s: BytesLike,
      v: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getERC20Addrs(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    getERC20AddrsPerProject(
      projectId: string,
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    isERC20ApprovedOnChainId(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isProjectERC20ApprovedOnChainId(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    multiSigThreshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    numReviewers(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    projApproved(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    projectDiamondAddrs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    reviewers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    setApproved(
      _projectId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setprojectNFTAddr(
      _newNFTAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addERC20PerChain(
    chainId: BigNumberish,
    _ERC20Addrs: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addProjectERC20PerChain(
    projectId: string,
    chainIds: BigNumberish[],
    ERC20Addrs: string[][],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  appSigningAddr(overrides?: CallOverrides): Promise<string>;

  checkApprovedERC20PerProjectByChain(
    projectId: string,
    chainId: BigNumberish,
    ERC20Addr: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  deployDiamond(
    _projectId: string,
    appSign: boolean,
    projectSigningAddr: string,
    _diamondCutFacet: string,
    r: BytesLike,
    s: BytesLike,
    v: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getERC20Addrs(
    chainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getERC20AddrsPerProject(
    projectId: string,
    chainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string[]>;

  isERC20ApprovedOnChainId(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isProjectERC20ApprovedOnChainId(
    arg0: string,
    arg1: BigNumberish,
    arg2: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  multiSigThreshold(overrides?: CallOverrides): Promise<BigNumber>;

  numReviewers(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  projApproved(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  projectDiamondAddrs(arg0: string, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  reviewers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  setApproved(
    _projectId: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setprojectNFTAddr(
    _newNFTAddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addERC20PerChain(
      chainId: BigNumberish,
      _ERC20Addrs: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    addProjectERC20PerChain(
      projectId: string,
      chainIds: BigNumberish[],
      ERC20Addrs: string[][],
      overrides?: CallOverrides
    ): Promise<void>;

    appSigningAddr(overrides?: CallOverrides): Promise<string>;

    checkApprovedERC20PerProjectByChain(
      projectId: string,
      chainId: BigNumberish,
      ERC20Addr: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    deployDiamond(
      _projectId: string,
      appSign: boolean,
      projectSigningAddr: string,
      _diamondCutFacet: string,
      r: BytesLike,
      s: BytesLike,
      v: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getERC20Addrs(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getERC20AddrsPerProject(
      projectId: string,
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string[]>;

    isERC20ApprovedOnChainId(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isProjectERC20ApprovedOnChainId(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    multiSigThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    numReviewers(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    projApproved(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    projectDiamondAddrs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    reviewers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    setApproved(_projectId: string, overrides?: CallOverrides): Promise<void>;

    setprojectNFTAddr(
      _newNFTAddr: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    addERC20PerChain(
      chainId: BigNumberish,
      _ERC20Addrs: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addProjectERC20PerChain(
      projectId: string,
      chainIds: BigNumberish[],
      ERC20Addrs: string[][],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    appSigningAddr(overrides?: CallOverrides): Promise<BigNumber>;

    checkApprovedERC20PerProjectByChain(
      projectId: string,
      chainId: BigNumberish,
      ERC20Addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deployDiamond(
      _projectId: string,
      appSign: boolean,
      projectSigningAddr: string,
      _diamondCutFacet: string,
      r: BytesLike,
      s: BytesLike,
      v: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getERC20Addrs(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getERC20AddrsPerProject(
      projectId: string,
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isERC20ApprovedOnChainId(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isProjectERC20ApprovedOnChainId(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multiSigThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    numReviewers(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    projApproved(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    projectDiamondAddrs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    reviewers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setApproved(
      _projectId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setprojectNFTAddr(
      _newNFTAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addERC20PerChain(
      chainId: BigNumberish,
      _ERC20Addrs: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addProjectERC20PerChain(
      projectId: string,
      chainIds: BigNumberish[],
      ERC20Addrs: string[][],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    appSigningAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    checkApprovedERC20PerProjectByChain(
      projectId: string,
      chainId: BigNumberish,
      ERC20Addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deployDiamond(
      _projectId: string,
      appSign: boolean,
      projectSigningAddr: string,
      _diamondCutFacet: string,
      r: BytesLike,
      s: BytesLike,
      v: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getERC20Addrs(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getERC20AddrsPerProject(
      projectId: string,
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isERC20ApprovedOnChainId(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isProjectERC20ApprovedOnChainId(
      arg0: string,
      arg1: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multiSigThreshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numReviewers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    projApproved(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    projectDiamondAddrs(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    reviewers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setApproved(
      _projectId: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setprojectNFTAddr(
      _newNFTAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
