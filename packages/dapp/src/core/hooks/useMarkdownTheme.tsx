import { Heading, HeadingProps, Text, TextProps } from "@chakra-ui/react";

export const useCardMarkdownTheme = () => {
  return {
    h1: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading as="h1" size="xl" color="text-weak">
          {children}
        </Heading>
      );
    },
    h2: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading as="h2" size="md" color="text-weak">
          {children}
        </Heading>
      );
    },
    h3: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h3" size="md" color="text">
          {children}
        </Heading>
      );
    },
    h4: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h4" size="md" color="text">
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
  const cardMdTheme = useCardMarkdownTheme();
  return {
    ...cardMdTheme,
    h1: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h1" size="xl" color="text-weak">
          {children}
        </Heading>
      );
    },
    h2: (props: HeadingProps) => {
      const { children } = props;
      return (
        <Heading py="2" as="h2" size="lg" color="text-weak">
          {children}
        </Heading>
      );
    },
  };
};
