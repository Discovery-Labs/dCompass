import { useRadio, Box, useColorModeValue } from "@chakra-ui/react";

const RadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { children } = props;
  return (
    <Box as="label" margin="5">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: useColorModeValue("primary.400", "accentDark.500"),
          color: useColorModeValue("white", "black"),
          borderColor: useColorModeValue("accentDark.500", "primary.400"),
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {children}
      </Box>
    </Box>
  );
};

export default RadioCard;
