import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Flex, Stack, Heading } from "@chakra-ui/layout";
import Web3 from "web3";
import {
  Avatar,
  Popover,
  PopoverTrigger,
  Image,
  Button,
  Text,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
} from "@chakra-ui/react";
import React from "react";

function CardWithImage({
  avatarSrc,
  coverSrc,
  description,
  heading,
  stat1,
  stat2,
  primaryActionOnClick,
  primaryAction,
  secondaryActionOnClick,
  secondaryAction,
  stat1Label,
  stat2Label,
}: {
  heading: string;
  description: string;
  avatarSrc: string;
  coverSrc: string;
  primaryActionOnClick: () => any;
  primaryAction: string;
  secondaryActionOnClick: () => any;
  secondaryAction: string;
  stat1: string;
  stat1Label: string;
  stat2: string;
  stat2Label: string;
}) {
  return (
    <Box
      maxW={"270px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"3xl"}
      overflow={"hidden"}
      my="5"
    >
      <Image
        alt="cover"
        h={"120px"}
        w={"full"}
        src={coverSrc}
        objectFit="cover"
      />
      <Flex justify={"center"} mt={-12}>
        <Avatar
          size={"xl"}
          src={avatarSrc}
          alt={"Author"}
          css={{
            border: "2px solid white",
          }}
        />
      </Flex>

      <Box p={6}>
        <Stack spacing={0} align={"center"} mb={5}>
          <Heading fontSize={"2xl"} fontWeight={600} fontFamily={"body"}>
            {heading || "No Name"}
          </Heading>
          <Text color={"gray.500"}>{description || "No Description"}</Text>
        </Stack>

        <Stack direction={"row"} justify={"center"} spacing={6}>
          <Stack spacing={0} align={"center"}>
            <Popover>
              <PopoverTrigger>
                <Button>{Web3.utils.fromWei(stat1).substring(0, 6)}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{Web3.utils.fromWei(stat1)}</PopoverHeader>
              </PopoverContent>
            </Popover>
            <Text fontSize={"sm"} color={"gray.500"}>
              {stat1Label}
            </Text>
          </Stack>
          <Stack spacing={0} align={"center"}>
            <Popover>
              <PopoverTrigger>
                <Button>{Web3.utils.fromWei(stat2).substring(0, 6)}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{Web3.utils.fromWei(stat2)}</PopoverHeader>
              </PopoverContent>
            </Popover>
            <Text fontSize={"sm"} color={"gray.500"}>
              {stat2Label}
            </Text>
          </Stack>
        </Stack>

        <Button w={"full"} mt={8} onClick={primaryActionOnClick}>
          {primaryAction}
        </Button>
        <Button w={"full"} mt={4} onClick={secondaryActionOnClick}>
          {secondaryAction}
        </Button>
      </Box>
    </Box>
  );
}

export default CardWithImage;
