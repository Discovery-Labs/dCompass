const semanticTokens = {
  colors: {
    error: 'red.500',
    bg: {
      default: 'neutralLightest',
      _dark: 'neutralDarkest',
    },
    'bg-medium': {
      default: 'neutralLighter',
      _dark: 'neutralDarker',
    },
    'bg-strong': {
      default: 'neutralLight',
      _dark: 'neutralDark',
    },
    border: {
      default: 'borderLight',
      _dark: 'borderDark',
    },
    'border-strong': {
      default: 'borderLight',
      _dark: 'borderDark',
    },
    text: {
      default: 'neutralDarkest',
      _dark: 'neutralLightest',
    },
    'text-weak': {
      default: 'neutralDarkerAlpha',
      _dark: 'neutralLighterAlpha',
    },
    'text-inverse': {
      default: 'neutralLightest',
      _dark: 'neutralDarkest',
    },
    primary: {
      default: 'primary.400',
      _dark: 'primary.300',
    },
    accent: {
      default: 'accent.400',
      _dark: 'accent.300',
    },
  },
};

// naming convention: property-(surface-variant) ex. bg-card-secondary
// strong = colored

export default semanticTokens;
