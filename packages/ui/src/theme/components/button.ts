import type {
  SystemStyleFunction,
  SystemStyleObject,
} from '@chakra-ui/theme-tools';
import { mode, transparentize } from '@chakra-ui/theme-tools';
import { colors } from '../colors';
import { borderRadius } from '../default-props';

const baseStyle: SystemStyleFunction = (props) => {
  // const { colorScheme: c, theme } = props;

  return {
    lineHeight: '1.2',
    borderRadius: borderRadius,
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    color: mode(colors.neutralLightest, colors.neutralDarkest)(props),
    _focus: {
      boxShadow: 'none',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    _hover: {
      _disabled: {
        bg: 'initial',
      },
    },
  };
};

const variantGhost: SystemStyleFunction = (props) => {
  const { colorScheme: c, theme } = props;

  if (c === 'gray') {
    return {
      color: mode(`inherit`, `whiteAlpha.900`)(props),
      _hover: {
        bg: mode(`gray.100`, `whiteAlpha.200`)(props),
      },
      _active: { bg: mode(`gray.200`, `whiteAlpha.300`)(props) },
    };
  }

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

  return {
    color: mode(`${c}.600`, `${c}.200`)(props),
    bg: 'transparent',
    _hover: {
      bg: mode(`${c}.50`, darkHoverBg)(props),
    },
    _active: {
      bg: mode(`${c}.100`, darkActiveBg)(props),
    },
  };
};

const variantOutline: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);
  return {
    border: '1px solid',
    borderColor: c === 'gray' ? borderColor : 'currentColor',
    ...variantGhost(props),
  };
};

const variantSolid: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props);

    return {
      bg,
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    };
  }

  return {
    bg: mode(`${c}.300`, `${c}.300`)(props),
    color: mode(colors.neutralLightest, colors.neutralLightest)(props),
    _hover: {
      bg: mode(`${c}.400`, `${c}.400`)(props),
      _disabled: {
        bg: mode(`${c}.500`, `${c}.200`)(props),
      },
    },
    _active: { bg: mode(`${c}.400`, `${c}.400`)(props) },
  };
};

const variantLink: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;
  return {
    padding: 0,
    height: 'auto',
    lineHeight: 'normal',
    verticalAlign: 'baseline',
    color: mode(`${c}.500`, `${c}.200`)(props),
    _hover: {
      textDecoration: 'underline',
      _disabled: {
        textDecoration: 'none',
      },
    },
    _active: {
      color: mode(`${c}.700`, `${c}.500`)(props),
    },
  };
};

const variantUnstyled: SystemStyleObject = {
  bg: 'none',
  color: 'inherit',
  display: 'inline',
  lineHeight: 'inherit',
  m: 0,
  p: 0,
};

const variants = {
  ghost: variantGhost,
  outline: variantOutline,
  solid: variantSolid,
  link: variantLink,
  unstyled: variantUnstyled,
};

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    h: 12,
    minW: 12,
    fontSize: 'lg',
    px: 6,
  },
  md: {
    h: 10,
    minW: 10,
    fontSize: 'md',
    px: 4,
  },
  sm: {
    h: 8,
    minW: 8,
    fontSize: 'sm',
    px: 3,
  },
  xs: {
    h: 6,
    minW: 6,
    fontSize: 'xs',
    px: 2,
  },
};

const defaultProps = {
  variant: 'solid',
  size: 'md',
};

export default {
  baseStyle,
  variants,
  sizes,
  defaultProps,
};
