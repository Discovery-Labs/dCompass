import { AbstractConnector } from "@web3-react/abstract-connector";
import { ConnectorUpdate } from "@web3-react/types";
import invariant from "tiny-invariant";

import { NetworkConnectorArguments } from "../types/network";

import MiniRpcProvider from "./MiniRpcProvider";

export default class NetworkConnector extends AbstractConnector {
  private readonly providers: { [chainId: number]: MiniRpcProvider };

  private currentChainId: number;

  constructor({ urls, defaultChainId }: NetworkConnectorArguments) {
    invariant(
      defaultChainId || Object.keys(urls).length === 1,
      "defaultChainId is a required argument with >1 url"
    );
    super({
      supportedChainIds: Object.keys(urls).map((k): number => Number(k)),
    });

    this.currentChainId = defaultChainId || Number(Object.keys(urls)[0]);
    this.providers = Object.keys(urls).reduce<{
      [chainId: number]: MiniRpcProvider;
    }>((accumulator, chainId) => {
      accumulator[Number(chainId)] = new MiniRpcProvider(
        Number(chainId),
        urls[Number(chainId)]
      );
      return accumulator;
    }, {});
  }

  public get provider(): MiniRpcProvider {
    return this.providers[this.currentChainId];
  }

  public async activate(): Promise<ConnectorUpdate> {
    return {
      provider: this.providers[this.currentChainId],
      chainId: this.currentChainId,
      account: null,
    };
  }

  public async getProvider(): Promise<MiniRpcProvider> {
    return this.providers[this.currentChainId];
  }

  public async getChainId(): Promise<number> {
    return this.currentChainId;
  }

  // eslint-disable-next-line class-methods-use-this
  public async getAccount(): Promise<null> {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  public deactivate() {}
}
