import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { colors } from './colors';
import components from './components';
import fonts from './fonts';
import layerStyles from './layer-styles';
import styles from './styles';
import textStyles from './text-styles';
import semanticTokens from './semantic-tokens';
import breakpoints from './breakpoints';
import { colorScheme } from './default-props';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const customTheme = extendTheme(
  {
    config,
    components,
    colors,
    fonts,
    styles,
    layerStyles,
    textStyles,
    semanticTokens,
    breakpoints,
  },
  withDefaultColorScheme({ colorScheme: colorScheme })
);
