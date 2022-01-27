export interface NetworkConnectorArguments {
  urls: { [chainId: number]: string };
  defaultChainId?: number;
}

// taken from ethers.js, compatible interface with web3 provider
export type AsyncSendable = {
  isMetaMask?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  send?: (request: any, callback: (error: any, response: any) => void) => void;
};

export interface BatchItem {
  request: { jsonrpc: "2.0"; id: number; method: string; params: unknown };
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}
