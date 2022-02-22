/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface PathwayNFTInterface extends utils.Interface {
  contractName: "PathwayNFT";
  functions: {
    "addPathwayCreationReward(string,address,bool,uint256)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "createPathway(string,string,bool,address,bool,uint256)": FunctionFragment;
    "createToken(string,string,string,bytes32[2],bytes32[2],uint8[2],uint256)": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "name()": FunctionFragment;
    "nativeRewards(string)": FunctionFragment;
    "owner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "pathwayMinted(string)": FunctionFragment;
    "projectIdforPathway(string)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "reviewerVotes(string,address)": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setAppDiamond(address)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "status(string)": FunctionFragment;
    "statusStrings(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenByIndex(uint256)": FunctionFragment;
    "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "voteForApproval(address[],string,string,bytes32[2],bytes32[2],uint8[2],uint256)": FunctionFragment;
    "voteForRejection(string,string,bytes32[2],bytes32[2],uint8[2],uint256)": FunctionFragment;
    "votes(string)": FunctionFragment;
    "votesReject(string)": FunctionFragment;
    "walletOfOwner(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addPathwayCreationReward",
    values: [string, string, boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "createPathway",
    values: [string, string, boolean, string, boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createToken",
    values: [
      string,
      string,
      string,
      [BytesLike, BytesLike],
      [BytesLike, BytesLike],
      [BigNumberish, BigNumberish],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nativeRewards",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pathwayMinted",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "projectIdforPathway",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reviewerVotes",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setAppDiamond",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "status", values: [string]): string;
  encodeFunctionData(
    functionFragment: "statusStrings",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "voteForApproval",
    values: [
      string[],
      string,
      string,
      [BytesLike, BytesLike],
      [BytesLike, BytesLike],
      [BigNumberish, BigNumberish],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "voteForRejection",
    values: [
      string,
      string,
      [BytesLike, BytesLike],
      [BytesLike, BytesLike],
      [BigNumberish, BigNumberish],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "votes", values: [string]): string;
  encodeFunctionData(functionFragment: "votesReject", values: [string]): string;
  encodeFunctionData(
    functionFragment: "walletOfOwner",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addPathwayCreationReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createPathway",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nativeRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pathwayMinted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "projectIdforPathway",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reviewerVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAppDiamond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "status", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "statusStrings",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "voteForApproval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "voteForRejection",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "votes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "votesReject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "walletOfOwner",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "NFTPathwayMinted(address,string,string)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PathwayApproved(string)": EventFragment;
    "ReceiveCalled(address,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTPathwayMinted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PathwayApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveCalled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  { owner: string; approved: string; tokenId: BigNumber }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  { owner: string; operator: string; approved: boolean }
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export type NFTPathwayMintedEvent = TypedEvent<
  [string, string, string],
  { _to: string; _tokenURI: string; _badgeId: string }
>;

export type NFTPathwayMintedEventFilter =
  TypedEventFilter<NFTPathwayMintedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type PathwayApprovedEvent = TypedEvent<[string], { _pathwayId: string }>;

export type PathwayApprovedEventFilter = TypedEventFilter<PathwayApprovedEvent>;

export type ReceiveCalledEvent = TypedEvent<
  [string, BigNumber],
  { _caller: string; _value: BigNumber }
>;

export type ReceiveCalledEventFilter = TypedEventFilter<ReceiveCalledEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; tokenId: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface PathwayNFT extends BaseContract {
  contractName: "PathwayNFT";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PathwayNFTInterface;

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
    addPathwayCreationReward(
      _pathwayId: string,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    createPathway(
      _pathwayId: string,
      _projectId: string,
      callRewards: boolean,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createToken(
      _tokenURI: string,
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    nativeRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    pathwayMinted(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    projectIdforPathway(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    reviewerVotes(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAppDiamond(
      newAppDiamond: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    status(arg0: string, overrides?: CallOverrides): Promise<[number]>;

    statusStrings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    voteForApproval(
      _contributors: string[],
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    voteForRejection(
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    votes(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    votesReject(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    walletOfOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;
  };

  addPathwayCreationReward(
    _pathwayId: string,
    _ERC20Address: string,
    useNative: boolean,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  createPathway(
    _pathwayId: string,
    _projectId: string,
    callRewards: boolean,
    _ERC20Address: string,
    useNative: boolean,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createToken(
    _tokenURI: string,
    _pathwayId: string,
    _projectId: string,
    r: [BytesLike, BytesLike],
    s: [BytesLike, BytesLike],
    v: [BigNumberish, BigNumberish],
    votesNeeded: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  nativeRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  pathwayMinted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  projectIdforPathway(arg0: string, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  reviewerVotes(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAppDiamond(
    newAppDiamond: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  status(arg0: string, overrides?: CallOverrides): Promise<number>;

  statusStrings(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenByIndex(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  voteForApproval(
    _contributors: string[],
    _pathwayId: string,
    _projectId: string,
    r: [BytesLike, BytesLike],
    s: [BytesLike, BytesLike],
    v: [BigNumberish, BigNumberish],
    votesNeeded: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  voteForRejection(
    _pathwayId: string,
    _projectId: string,
    r: [BytesLike, BytesLike],
    s: [BytesLike, BytesLike],
    v: [BigNumberish, BigNumberish],
    votesNeeded: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  votes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  votesReject(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  walletOfOwner(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  callStatic: {
    addPathwayCreationReward(
      _pathwayId: string,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    createPathway(
      _pathwayId: string,
      _projectId: string,
      callRewards: boolean,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    createToken(
      _tokenURI: string,
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    nativeRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    pathwayMinted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    projectIdforPathway(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    reviewerVotes(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setAppDiamond(
      newAppDiamond: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    status(arg0: string, overrides?: CallOverrides): Promise<number>;

    statusStrings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    voteForApproval(
      _contributors: string[],
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    voteForRejection(
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    votes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    votesReject(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    walletOfOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;

    "ApprovalForAll(address,address,bool)"(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "NFTPathwayMinted(address,string,string)"(
      _to?: string | null,
      _tokenURI?: string | null,
      _badgeId?: string | null
    ): NFTPathwayMintedEventFilter;
    NFTPathwayMinted(
      _to?: string | null,
      _tokenURI?: string | null,
      _badgeId?: string | null
    ): NFTPathwayMintedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "PathwayApproved(string)"(
      _pathwayId?: string | null
    ): PathwayApprovedEventFilter;
    PathwayApproved(_pathwayId?: string | null): PathwayApprovedEventFilter;

    "ReceiveCalled(address,uint256)"(
      _caller?: null,
      _value?: null
    ): ReceiveCalledEventFilter;
    ReceiveCalled(_caller?: null, _value?: null): ReceiveCalledEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
  };

  estimateGas: {
    addPathwayCreationReward(
      _pathwayId: string,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    createPathway(
      _pathwayId: string,
      _projectId: string,
      callRewards: boolean,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createToken(
      _tokenURI: string,
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    nativeRewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pathwayMinted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    projectIdforPathway(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    reviewerVotes(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAppDiamond(
      newAppDiamond: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    status(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    statusStrings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    voteForApproval(
      _contributors: string[],
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    voteForRejection(
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    votes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    votesReject(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    walletOfOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPathwayCreationReward(
      _pathwayId: string,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createPathway(
      _pathwayId: string,
      _projectId: string,
      callRewards: boolean,
      _ERC20Address: string,
      useNative: boolean,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createToken(
      _tokenURI: string,
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nativeRewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pathwayMinted(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    projectIdforPathway(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    reviewerVotes(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAppDiamond(
      newAppDiamond: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    status(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    statusStrings(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    voteForApproval(
      _contributors: string[],
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    voteForRejection(
      _pathwayId: string,
      _projectId: string,
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      v: [BigNumberish, BigNumberish],
      votesNeeded: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    votes(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    votesReject(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    walletOfOwner(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}