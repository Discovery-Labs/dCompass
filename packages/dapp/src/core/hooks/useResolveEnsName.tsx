import { Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";
import { useState, useEffect } from "react";

/**
 * @internal
 *
 * @param provider
 * @param address
 * @returns
 */
const lookupAddress = async (
  provider: Web3Provider,
  address: string
): Promise<string> => {
  if (utils.isAddress(address)) {
    try {
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await provider.lookupAddress(address);
      if (!reportedName) {
        return "";
      }

      const resolvedAddress = await provider.resolveName(reportedName);
      if (!resolvedAddress) {
        return "";
      }

      if (
        address &&
        utils.getAddress(address) === utils.getAddress(resolvedAddress)
      ) {
        return reportedName;
      }
      return utils.getAddress(address);
    } catch (e) {
      return utils.getAddress(address);
    }
  }
  return "";
};

/**
 * #### Summary
 * Gets ENS name for given address
 *
 * @category Hooks
 *
 * @param mainnetProvider mainnet provider
 * @param address
 * @returns
 */
const useResolveEnsName = (
  mainnetProvider: Web3Provider | undefined,
  address: string
): string => {
  const [ensName, setEnsName] = useState(address);

  useEffect(() => {
    const storedData: any = window.localStorage.getItem(`ensCache_${address}`);
    const cache = JSON.parse(storedData ?? "{}") as Record<string, any>;

    if (cache && cache?.name && cache?.timestamp > Date.now()) {
      setEnsName(cache?.name);
    } else if (mainnetProvider) {
      lookupAddress(mainnetProvider, address).then((name) => {
        if (name) {
          setEnsName(name);
          window.localStorage.setItem(
            `ensCache_${address}`,
            JSON.stringify({
              timestamp: Date.now() + 360000,
              name,
            })
          );
        }
      });
    }
  }, [address, mainnetProvider]);

  return ensName;
};

export default useResolveEnsName;
