import { useColorModeValue } from '@chakra-ui/react';
import { colors } from '../../src';

function useColor() {
  const textVioletColor = useColorModeValue(
    colors.neutralDark,
    colors.neutralLight
  );
  const titleColor = useColorModeValue(
    colors.accent[500],
    colors.accent[500]
  );
  const accentColorScheme = useColorModeValue('accent', 'accent');

  return { textVioletColor, titleColor, accentColorScheme };
}

export default useColor;
