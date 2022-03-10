import { useCheckbox, Box, Text } from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";

const CheckboxCard = (props: any) => {
  const { getAccentColor } = useCustomColor();
  const { state, getInputProps, getCheckboxProps, getLabelProps, htmlProps } =
    useCheckbox(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const label = getLabelProps();
  const { children } = props;
  return (
    <Box as="label" margin="5" {...htmlProps}>
      <input {...input} />
      {state.isChecked ? (
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          px={5}
          py={3}
          borderColor={getAccentColor}
        >
          <Text {...label}>{children}</Text>
        </Box>
      ) : (
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          px={5}
          py={3}
        >
          <Text {...label}>{children}</Text>
        </Box>
      )}
    </Box>
  );
};

export default CheckboxCard;
