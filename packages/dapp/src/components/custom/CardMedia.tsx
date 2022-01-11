import { VStack, Image, Box } from "@chakra-ui/react";

function CardMedia({ children, src, ...others }: any) {
  return (
    <VStack
      layerStyle="no-border-card"
      bg="neutralDarker"
      h="lg"
      spacing="4"
      align="start"
      {...others}
    >
      <Box w="full" position="relative">
        <Box position="static">
          <Image position="absolute" top="0px" src={src} filter="blur(10px)" />
        </Box>
        <Box position="relative">
          <Image borderRadius="8" w="full" src={src} objectFit="cover" />
        </Box>
      </Box>
      {children}
    </VStack>
  );
}

export default CardMedia;
