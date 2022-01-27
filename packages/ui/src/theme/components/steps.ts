import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { darken } from '@chakra-ui/theme-tools';
import { StepsStyleConfig } from 'chakra-ui-steps';
import useThemeColor from '../../hooks/useThemeColor';

const baseStyle: SystemStyleFunction = (props) => {
  const {
    getTextColor,
    getPrimaryColor,
    getBorderColor,
    getHover2Color,
    getOverBgColor,
  } = useThemeColor();

  //   const colorMode = 'light';
  //   const inactiveColor = colorMode === 'light' ? 'gray.100' : 'gray.700';
  //   const color = colorMode === 'light' ? 'blue' : 'white';
  return {
    steps: {
      color: getTextColor(props),
    },
    connector: {
      // this is the track color of the connector between steps
      borderColor: getHover2Color(props),
      transitionProperty: 'border-color',
      transitionDuration: 'normal',
      _highlighted: {
        borderColor: getPrimaryColor(props),
      },
    },
    stepIconContainer: {
      bg: getOverBgColor(props),
      borderColor: getBorderColor(props),
      borderRadius: 'full',
      _activeStep: {
        bg: darken(getOverBgColor(props), 0.5),
        borderColor: getPrimaryColor(props),
        _invalid: {
          bg: 'red.500',
          borderColor: 'red.500',
        },
      },
      _highlighted: {
        bg: getPrimaryColor(props),
        borderColor: getPrimaryColor(props),
      },
      '&[data-clickable]:hover': {
        borderColor: getPrimaryColor(props),
      },
    },
    label: {
      color: getTextColor(props),
    },
  };
};

const Steps = {
  ...StepsStyleConfig,

  baseStyle: baseStyle,
};

export default Steps;
