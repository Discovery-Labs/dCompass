import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  SkeletonCircle,
  SkeletonText,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import { useResolveEnsName } from "core/hooks/useResolveEnsName";
import Blockies from "react-blockies";
import {
  MdCheckCircle,
  MdContentCopy,
  MdOutlinePersonSearch,
} from "react-icons/md";

const blockExplorerLink = (address: string, blockExplorer?: string) =>
  `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

// eslint-disable-next-line complexity
function MemberAddress({
  value,
  address,
  size = "long",
  blockExplorer,
  minimized = false,
  fontSize,
}: {
  value: string;
  address: string;
  size?: "long" | "short";
  blockExplorer?: string;
  minimized?: boolean;
  fontSize?: string;
}) {
  const account = value || address;
  const { ens } = useResolveEnsName(address);
  const { hasCopied, onCopy } = useClipboard(account);
  const { getColoredText } = useCustomColor();
  if (!account) {
    return (
      <Box padding="6" as="span">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
      </Box>
    );
  }

  let displayAddress = account.slice(0, 6);

  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  if (validEnsCheck) {
    displayAddress = ens;
  } else if (size === "short") {
    displayAddress += `...${account.slice(-4)}`;
  } else if (size === "long") {
    displayAddress = account;
  }

  const etherscanLink = blockExplorerLink(account, blockExplorer);
  if (minimized) {
    return (
      <Box as="span" verticalAlign="middle">
        <Link target="_blank" href={etherscanLink} rel="noopener noreferrer">
          <Blockies seed={account} className="blockies" size={8} scale={2} />
        </Link>
      </Box>
    );
  }

  const text = (
    <Flex alignItems="center" justifyContent="center" flexGrow={1}>
      <Text _hover={{ color: getColoredText }}>{displayAddress}</Text>
    </Flex>
  );

  return (
    <HStack
      w="full"
      layerStyle="solid-card"
      py="1"
      px="2"
      _hover={{ cursor: "pointer", bg: "lighten(0.2)" }}
      fontSize={fontSize ?? 28}
    >
      <Blockies className="blockies" seed={account} />
      {text}
      <IconButton
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
        aria-label="Copy Address"
        fontSize={fontSize}
        icon={hasCopied ? <Icon as={MdCheckCircle} /> : <MdContentCopy />}
      />
      <IconButton
        size="sm"
        variant="ghost"
        onClick={(e) => {
          console.log("go to profile", e);
        }}
        aria-label="Go to profile"
        fontSize={fontSize}
        icon={<Icon as={MdOutlinePersonSearch} />}
      />
    </HStack>
  );
}

export default MemberAddress;
