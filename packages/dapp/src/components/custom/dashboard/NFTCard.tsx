import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, VStack, Flex, Heading, Image, Link } from "@chakra-ui/react";
import { useNft } from "use-nft";

export interface NFTProps {
  contractAddress: string;
  tokenId: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

function NFTV2({ contractAddress, tokenId, size = "xs" }: NFTProps) {
  const { loading, error, nft } = useNft(contractAddress, tokenId);
  const openseaLink = `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}/`;

  if (loading) return <>Loading…</>;

  if (error || !nft) return <>Error.</>;

  return (
    <VStack
      justify="space-between"
      maxW={size}
      borderRadius="lg"
      borderWidth="1px"
      overflow="hidden"
    >
      <Image
        h="sm"
        w="full"
        objectFit="cover"
        src={nft.image}
        alt={nft.name}
        borderRadius="lg"
      />
      <Box p="6">
        <Link href={openseaLink} isExternal>
          <Flex alignItems="center" justifyContent="space-between" pb="2">
            <Heading as="h3" size="sm" style={{ overflowWrap: "anywhere" }}>
              {nft.name}
            </Heading>
            <ExternalLinkIcon ml="2" />
          </Flex>
        </Link>
      </Box>
    </VStack>
  );
}

export default NFTV2;
