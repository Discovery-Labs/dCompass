import {
  Box,
  Stack,
  HStack,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  useRadio,
  useRadioGroup,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { REQUIRED_FIELD_LABEL } from "../../core/constants";

import useCustomColor from "../../core/hooks/useCustomColor";

function PriceWrapper(props: any) {
  const { getAccentColor } = useCustomColor();

  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { children } = props;

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        mb={4}
        shadow="base"
        borderWidth="1px"
        alignSelf={{ base: "center", lg: "flex-start" }}
        borderColor={useColorModeValue("primary.200", "primary.500")}
        borderRadius="xl"
        _checked={{
          borderColor: getAccentColor,
          borderWidth: "2px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default function ThreeTierPricing() {
  const { getBgColor } = useCustomColor();
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const [selectedPass, setSelectedPass] = useState("GOLD");
  function selectPlan(plan: string) {
    setValue("sponsorTier", plan);
    setSelectedPass(plan);
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "pricing",
    defaultValue: "GOLD",
    onChange: selectPlan,
  });

  const group = getRootProps();
  const radioSilver = getRadioProps({ value: "SILVER" });
  const radioGold = getRadioProps({ value: "GOLD" });
  const radioDiamond = getRadioProps({ value: "DIAMOND" });

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Project Sponsor Pass
        </Heading>
        <Text fontSize="lg" color="purple.500">
          Support dCompass and get your project displayed on the platform.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
        {...group}
      >
        <PriceWrapper key="SILVER" {...radioSilver}>
          <Box py={4} px={12}>
            <Heading fontWeight="500" size="2xl" color="silver">
              Silver
            </Heading>
            <HStack justifyContent="center">
              <Text fontSize="5xl" fontWeight="600" color="purple.500">
                Ξ
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                1
              </Text>
            </HStack>
          </Box>
          <VStack bg={getBgColor} py={4} borderBottomRadius="xl">
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />
                unlimited quests &amp; paths
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />
                contributor management
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />
                pathways &amp; quest analytics
              </ListItem>
            </List>
          </VStack>
        </PriceWrapper>

        <PriceWrapper key="GOLD" {...radioGold}>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                textTransform="uppercase"
                bg="purple.500"
                px={3}
                py={1}
                color="accentDark.500"
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Heading fontWeight="500" size="2xl" color="GOLD">
                Gold
              </Heading>
              <HStack justifyContent="center">
                <Text fontSize="5xl" fontWeight="600" color="purple.500">
                  Ξ
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  3
                </Text>
              </HStack>
            </Box>
            <VStack bg={getBgColor} py={4} borderBottomRadius="xl">
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="accentDark.500" />
                  everything from Silver tier
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="accentDark.500" />
                  displayed as a featured project
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="accentDark.500" />
                  pathway &amp; quest creation guidance
                </ListItem>
              </List>
            </VStack>
          </Box>
        </PriceWrapper>
        <PriceWrapper key="DIAMOND" {...radioDiamond}>
          <Box py={4} px={12}>
            <Heading fontWeight="500" size="2xl" color="cyan">
              Diamond
            </Heading>
            <HStack justifyContent="center">
              <Text fontSize="5xl" fontWeight="600" color="purple.500">
                Ξ
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                5
              </Text>
            </HStack>
          </Box>
          <VStack bg={getBgColor} py={4} borderBottomRadius="xl">
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />
                everything from Gold tier
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />1 custom
                quest development
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="accentDark.500" />1 custom
                pathway guide creation
              </ListItem>
            </List>
          </VStack>
        </PriceWrapper>
      </Stack>

      <Center>
        <VStack>
          <HStack>
            <Text>Your selected pass is</Text>{" "}
            <Text color={selectedPass === "DIAMOND" ? "cyan" : selectedPass}>
              {selectedPass}
            </Text>
          </HStack>
          <FormControl isInvalid={errors.projectWallet}>
            <FormLabel htmlFor="projectWallet">Project wallet</FormLabel>

            <Input
              placeholder="project Wallet"
              {...register("projectWallet", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 150,
                  message: "Maximum length should be 150",
                },
              })}
            />
            <FormErrorMessage>
              {errors.projectWallet && errors.projectWallet.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
      </Center>
    </Box>
  );
}
