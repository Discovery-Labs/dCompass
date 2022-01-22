import {
  Box,
  Flex,
  HStack,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  Text,
  useDisclosure,
  useClipboard,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Blockies from "react-blockies";
import { MdCheckCircle, MdContentCopy } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";

import useCustomColor from "../../core/hooks/useCustomColor";
import { useResolveEnsName } from "../../core/hooks/useResolveEnsName";

const blockExplorerLink = (address: string, blockExplorer?: string) =>
  `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

// eslint-disable-next-line complexity
function Address({
  value,
  address,
  logout,
  size = "long",
  blockExplorer,
  minimized = false,
  onChange,
  fontSize,
}: {
  value: string;
  address: string;
  logout?: any;
  size?: "long" | "short";
  blockExplorer?: string;
  minimized?: boolean;
  onChange?: any;
  fontSize?: string;
}) {
  const account = value || address;
  const { ens } = useResolveEnsName(address);
  const { hasCopied, onCopy } = useClipboard(account);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  // let text;
  // if (onChange) {
  //   text = (
  //     <Editable placeholder={account}>
  //       <EditablePreview width="100%" />
  //       <Link target="_blank" href={etherscanLink} rel="noopener noreferrer">
  //         <EditableInput value={displayAddress} onChange={onChange} />
  //       </Link>
  //     </Editable>
  //   );
  // } else {
  //   text = (
  //     <Flex alignItems="center" justifyContent="center" flexGrow={1}>
  //       <Link
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         border="none"
  //         textOverflow={displayAddress.startsWith("0x") ? "ellipsis" : "unset"}
  //         href={etherscanLink}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <RiExternalLinkFill />
  //         {displayAddress}
  //       </Link>
  //     </Flex>
  //   );
  // }

  return (
    <HStack
      layerStyle="solid-card"
      py="1"
      px="2"
      _hover={{ cursor: "pointer", bg: "lighten(0.2)" }}
      fontSize={fontSize ?? 28}
      onClick={onOpen}
    >
      <Flex>
        <Blockies className="blockies" seed={account} />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Connected with MetaMask
            <Text textStyle="small" color={getColoredText}>
              You can copy the address or view on explorer
            </Text>
            <HStack
              my="8"
              layerStyle="solid-card"
              py="1"
              px="2"
              justify="start"
            >
              {text}
              <IconButton
                size="sm"
                variant="ghost"
                onClick={onCopy}
                aria-label="Copy Address"
                fontSize={fontSize}
                icon={
                  hasCopied ? (
                    <Icon color="aqua.300" as={MdCheckCircle} />
                  ) : (
                    <MdContentCopy />
                  )
                }
              />
            </HStack>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="none"
              textOverflow={
                displayAddress.startsWith("0x") ? "ellipsis" : "unset"
              }
              href={etherscanLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to etherscan
              <Icon as={RiExternalLinkFill} pl="2" />
            </Link>
          </ModalBody>

          <ModalFooter>
            <Button w="full" onClick={logout}>
              Log out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {text}
      {/* <IconButton
        size="sm"
        variant="ghost"
        onClick={onCopy}
        aria-label="Copy Address"
        fontSize={fontSize}
        icon={hasCopied ? <Icon as={MdCheckCircle} /> : <MdContentCopy />}
      /> */}
    </HStack>
  );
}

export default Address;
