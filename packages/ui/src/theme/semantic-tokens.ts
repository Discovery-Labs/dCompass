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
      default: 'neutralDark',
      _dark: 'neutralLight',
    },
    'text-inverted': {
      default: 'neutralLightest',
      _dark: 'neutralDarkest',
    },
    primary: {
      default: 'primary.500',
      _dark: 'primary.200',
    },
    accent: {
      default: 'accentLight.500',
      _dark: 'accentDark.500',
    },
  },
};

// naming convention: property-(surface-variant) ex. bg-card-secondary
// strong = colored

export default semanticTokens;
