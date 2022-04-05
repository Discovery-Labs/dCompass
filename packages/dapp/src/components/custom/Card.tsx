import { StackProps, VStack } from "@chakra-ui/react";

function Card(props: StackProps) {
  const { children, ...others } = props;
  return (
    <VStack
      layerStyle="solid-card"
      h="lg"
      borderRadius="base"
      spacing="4"
      align="start"
      {...others}
    >
      {children}
    </VStack>
  );
}

export default Card;
