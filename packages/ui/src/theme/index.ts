import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

import breakpoints from './breakpoints';
import { colors } from './colors';
import components from './components';
import { colorScheme } from './default-props';
import fonts from './fonts';
import layerStyles from './layer-styles';
import semanticTokens from './semantic-tokens';
import styles from './styles';
import textStyles from './text-styles';

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
