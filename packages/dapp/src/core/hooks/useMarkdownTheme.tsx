import { Heading, HeadingProps, Text, TextProps } from "@chakra-ui/react";

import useCustomColor from "./useCustomColor";

export const useCardMarkdownTheme = () => {
  const { getColoredText, getTextColor } = useCustomColor();
  return {
    h1: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading as="h1" size="xl" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h2: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading as="h2" size="md" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h3: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h3" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    h4: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h4" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    p: (props: TextProps) => {
      const { children } = props;
      return (
        <Text w="full" fontSize="xl">
          {children}
        </Text>
      );
    },
  };
};

export const usePageMarkdownTheme = () => {
  const { getColoredText } = useCustomColor();
  const cardMdTheme = useCardMarkdownTheme();
  return {
    ...cardMdTheme,
    h1: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h1" size="xl" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h2: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h2" size="lg" color={getColoredText}>
          {children}
        </Heading>
      );
    },
  };
};
