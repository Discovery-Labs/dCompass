import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import React from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import { MoralisChainId } from "../../types";

const BalancesButton = ({
  chainId,
  address,
}: {
  chainId: MoralisChainId;
  address: string;
}) => {
  const { web3 } = useMoralis();
  const {
    account: { getNativeBalance },
  } = useMoralisWeb3Api();

  const getNativeBalanceQuery = useMoralisWeb3ApiCall(getNativeBalance, {
    chain: chainId,
    address,
  });

  const bgColor = useColorModeValue("violet.100", "blue.700");
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <IconButton
          onClick={() => getNativeBalanceQuery.fetch()}
          aria-label="balances"
          icon={<FaEthereum />}
        />
      </PopoverTrigger>
      <PopoverContent backgroundColor={bgColor} rounded="3xl">
        <PopoverHeader fontWeight="semibold">
          Native token balance
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody fontSize="2xl">
          {web3?.utils.fromWei(getNativeBalanceQuery.data?.balance || "0")}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default BalancesButton;
