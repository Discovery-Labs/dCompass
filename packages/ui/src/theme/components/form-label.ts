import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import useThemeColor from '../../hooks/useThemeColor';

const baseStyle: SystemStyleFunction = (props) => {
  const { getTextColor } = useThemeColor();
  return {
    fontSize: 'md',
    textTransform: 'uppercase',
    marginEnd: 3,
    mb: 2,
    color: getTextColor(props),
    fontWeight: 'medium',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    opacity: 1,
    _disabled: {
      opacity: 0.4,
    },
  };
};

export default {
  baseStyle,
};
