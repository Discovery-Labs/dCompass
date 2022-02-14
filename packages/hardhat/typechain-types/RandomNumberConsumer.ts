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
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface RandomNumberConsumerInterface extends utils.Interface {
  contractName: "RandomNumberConsumer";
  functions: {
    "addContractToWhiteList(address)": FunctionFragment;
    "blockNumberResults(string)": FunctionFragment;
    "getObjectRarities(string)": FunctionFragment;
    "getRandomNumber(string,uint256)": FunctionFragment;
    "numContributors(bytes32)": FunctionFragment;
    "objectRequests(bytes32)": FunctionFragment;
    "owner()": FunctionFragment;
    "rawFulfillRandomness(bytes32,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "requestResults(string)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addContractToWhiteList",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "blockNumberResults",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getObjectRarities",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRandomNumber",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "numContributors",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "objectRequests",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rawFulfillRandomness",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestResults",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addContractToWhiteList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blockNumberResults",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getObjectRarities",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRandomNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numContributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "objectRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rawFulfillRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestResults",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "RandomNumberFulfilled(string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RandomNumberFulfilled"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type RandomNumberFulfilledEvent = TypedEvent<
  [string],
  { _projectId: string }
>;

export type RandomNumberFulfilledEventFilter =
  TypedEventFilter<RandomNumberFulfilledEvent>;

export interface RandomNumberConsumer extends BaseContract {
  contractName: "RandomNumberConsumer";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RandomNumberConsumerInterface;

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
    addContractToWhiteList(
      _newWhiteList: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    blockNumberResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getObjectRarities(
      _objectId: string,
      overrides?: CallOverrides
    ): Promise<[number[]]>;

    getRandomNumber(
      _objectId: string,
      _numContributors: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    numContributors(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    objectRequests(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    requestResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addContractToWhiteList(
    _newWhiteList: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  blockNumberResults(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getObjectRarities(
    _objectId: string,
    overrides?: CallOverrides
  ): Promise<number[]>;

  getRandomNumber(
    _objectId: string,
    _numContributors: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  numContributors(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  objectRequests(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  rawFulfillRandomness(
    requestId: BytesLike,
    randomness: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  requestResults(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addContractToWhiteList(
      _newWhiteList: string,
      overrides?: CallOverrides
    ): Promise<void>;

    blockNumberResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getObjectRarities(
      _objectId: string,
      overrides?: CallOverrides
    ): Promise<number[]>;

    getRandomNumber(
      _objectId: string,
      _numContributors: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    numContributors(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    objectRequests(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    requestResults(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

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

    "RandomNumberFulfilled(string)"(
      _projectId?: string | null
    ): RandomNumberFulfilledEventFilter;
    RandomNumberFulfilled(
      _projectId?: string | null
    ): RandomNumberFulfilledEventFilter;
  };

  estimateGas: {
    addContractToWhiteList(
      _newWhiteList: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    blockNumberResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getObjectRarities(
      _objectId: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRandomNumber(
      _objectId: string,
      _numContributors: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    numContributors(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    objectRequests(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    requestResults(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addContractToWhiteList(
      _newWhiteList: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    blockNumberResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getObjectRarities(
      _objectId: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRandomNumber(
      _objectId: string,
      _numContributors: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    numContributors(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    objectRequests(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rawFulfillRandomness(
      requestId: BytesLike,
      randomness: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    requestResults(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
