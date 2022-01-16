import { VStack, Image, Box } from "@chakra-ui/react";

import useCustomColor from "../../core/hooks/useCustomColor";

function CardMedia({ children, src, imageHeight = "120px", ...others }: any) {
  const { getOverBgColor } = useCustomColor();
  return (
    <VStack
      layerStyle="no-border-card"
      bg={getOverBgColor}
      h="lg"
      spacing="4"
      align="start"
      {...others}
    >
      <Box w="full" position="relative">
        <Box position="static">
          <Image
            height={imageHeight}
            width="full"
            position="absolute"
            top="0px"
            src={src}
            filter="blur(10px)"
          />
        </Box>
        <Box position="relative">
          <Image
            height={imageHeight}
            borderRadius="8"
            w="full"
            src={src}
            objectFit="cover"
          />
        </Box>
      </Box>
      {children}
    </VStack>
  );
}

export default CardMedia;
