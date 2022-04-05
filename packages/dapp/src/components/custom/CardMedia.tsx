import { VStack, Image, Box } from "@chakra-ui/react";

import useCustomColor from "../../core/hooks/useCustomColor";

function CardMedia({ children, src, imageHeight = "160px", ...others }: any) {
  const { getOverBgColor } = useCustomColor();
  return (
    <>
      <VStack
        layerStyle="outline-hover3"
        bg={getOverBgColor}
        h="lg"
        // p="0"
        // spacing="3"
        align="start"
        role="group"
        {...others}
      >
        <Box w="full" position="relative">
          <Box borderRadius="lg" position="relative" overflow="hidden">
            <Image
              alt="media image"
              height={imageHeight}
              borderRadius="8"
              w="full"
              src={src}
              objectFit="cover"
              filter="blur(80px)"
              transition="filter 0.3s"
              _groupHover={{
                filter: "blur(50px)",
              }}
            />
          </Box>
          <Box w="full" position="static">
            <Image
              alt="media image"
              height={imageHeight}
              // width="full"
              position="absolute"
              borderRadius="full"
              top="50%"
              left="50%"
              boxSize="120px"
              transition="all 0.3s"
              transform="translate(-50%, -50%)"
              src={src}
              // _hover={{
              //   transform: "scale(2.05) translate(-50%, -50%)",
              // }}
              // filter="blur(10px)"
            />
          </Box>
        </Box>
        <Box w="full" h="full">
          {children}
        </Box>
      </VStack>
    </>
  );
}

export default CardMedia;
