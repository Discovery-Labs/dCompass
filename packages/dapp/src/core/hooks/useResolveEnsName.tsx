import { providers, utils } from "ethers";
import { useState, useEffect } from "react";

/**
 * @internal
 *
 * @param provider
 * @param address
 * @returns
 */
export const lookupAddress = async (address: string): Promise<string> => {
  if (utils.isAddress(address)) {
    try {
      const infuraPovider = new providers.InfuraProvider(
        1,
        process.env.NEXT_PUBLIC_INFURA_ID
      );
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await infuraPovider.lookupAddress(address);

      if (!reportedName) {
        return "";
      }

      const resolvedAddress = await infuraPovider.resolveName(reportedName);
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
export const useResolveEnsName = (
  address: string
): {
  ens: string;
  lookupAddress: (address: string) => Promise<string>;
} => {
  const [ensName, setEnsName] = useState(address);

  useEffect(() => {
    const storedData: any = window.localStorage.getItem(`ensCache_${address}`);
    const cache = JSON.parse(storedData ?? "{}") as Record<string, any>;

    if (cache && cache?.name && cache?.timestamp > Date.now()) {
      setEnsName(cache?.name);
    } else {
      lookupAddress(address).then((name) => {
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
  }, [address]);

  return { ens: ensName, lookupAddress };
};
