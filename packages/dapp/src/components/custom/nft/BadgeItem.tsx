import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, VStack, Flex, Text, Image, Link } from "@chakra-ui/react";
import { useNft } from "use-nft";

import useCustomColor from "core/hooks/useCustomColor";

export interface NFTProps {
  contractAddress: string;
  tokenId: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

function BadgeItem({ contractAddress, tokenId }: NFTProps) {
  const { loading, error, nft } = useNft(contractAddress, tokenId);
  const openseaLink = `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}/`;
  const { getPrimaryColor } = useCustomColor();

  if (loading) return <>Loading…</>;

  if (error || !nft) return <>Error.</>;
  return (
    <VStack>
      <Box
        position="relative"
        p="0"
        maxW="120px"
        maxH="120px"
        borderRadius="full"
        borderWidth="4px"
        overflow="hidden"
        _hover={{ borderColor: getPrimaryColor, filter: "lighten(0.5)" }}
      >
        <Image
          w="full"
          objectFit="cover"
          src={nft.image}
          alt={nft.name}
          borderRadius="lg"
        />
      </Box>
      {/* <Box position="static">
        <Box
          visibility="hidden"
          position="absolute"
          w="full"
          top="0px"
          _hover={{ visibility: "visible" }}
          p="6"
          zIndex={999}
        >
          <Link href={openseaLink} isExternal>
            <Flex alignItems="center" justifyContent="space-between" pb="2">
              <Text fontSize="xs" style={{ overflowWrap: "anywhere" }}>
                {nft.name}
              </Text>
              <ExternalLinkIcon boxSize={4} />
            </Flex>
          </Link>
        </Box>
      </Box> */}
      <Link href={openseaLink} isExternal>
        <Flex alignItems="center" justifyContent="space-between" pb="2">
          <Text fontSize="xs" style={{ overflowWrap: "anywhere" }}>
            {nft.name}
          </Text>
          <ExternalLinkIcon boxSize={4} />
        </Flex>
      </Link>
    </VStack>
  );
}

export default BadgeItem;
