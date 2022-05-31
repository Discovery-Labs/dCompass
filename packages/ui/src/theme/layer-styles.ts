import { darken, lighten } from '@chakra-ui/theme-tools';
import { colors } from './colors';
import { borderRadius } from './default-props';

const layerStyles = {
  'gradient-border': {
    p: '2px',
    borderRadius: borderRadius,
    bgGradient: `linear(45deg, ${colors.primary[500]}, ${colors.accent[500]}, ${colors.primary[500]})`,
  },
  'gradient-bg': {
    bgGradient: `linear(45deg, ${colors.primary[500]}, ${colors.accent[500]}, ${colors.primary[500]})`,
    '.chakra-ui-dark &': {
      bgGradient: `linear(45deg, ${colors.primary[500]}, ${colors.accent[500]}, ${colors.primary[500]})`,
    },
  },
  'gradient-text': {
    bgGradient: `linear(45deg, ${colors.primary[500]}, ${colors.accent[500]}, ${colors.primary[500]})`,
    bgClip: 'text',
  },
  'solid-card': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    border: '1px solid',
    borderColor: colors.borderLight,
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
      border: '1px solid',
      borderColor: colors.borderDark,
    },
  },
  'outline-card': {
    p: '1.5rem',
    border: '1px solid',
    borderRadius: borderRadius,
    borderColor: colors.borderLight,
    '.chakra-ui-dark &': {
      borderColor: colors.borderDark,
    },
  },
  'no-border-card': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
    },
  },

  // With hover highlight
  'solid-hover2': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    border: '1px solid',
    borderColor: colors.borderLight,
    _hover: { bg: darken(colors.neutralLighter, 5) },
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
      border: '1px solid',
      borderColor: colors.borderDark,
      _hover: { bg: lighten(colors.neutralDarker, 5) },
    },
  },
  'outline-hover2': {
    p: '1.5rem',
    border: '1px solid',
    borderRadius: borderRadius,
    borderColor: colors.borderLight,
    _hover: { bg: darken(colors.neutralLighter, 5) },
    '.chakra-ui-dark &': {
      borderColor: colors.borderDark,
      _hover: { bg: lighten(colors.neutralDarker, 5) },
    },
  },
  'no-border-hover2': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    _hover: { bg: darken(colors.neutralLighter, 5) },
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
      _hover: { bg: lighten(colors.neutralDarker, 5) },
    },
  },

  // With Y transform on hover
  'solid-hover': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    border: '1px solid',
    borderColor: colors.borderLight,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'translateY(-4px)', shadow: 'lg' },
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
      border: '1px solid',
      borderColor: colors.borderDark,
    },
  },
  'outline-hover': {
    p: '1.5rem',
    border: '1px solid',
    borderRadius: borderRadius,
    borderColor: colors.borderLight,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'translateY(-4px)', shadow: 'lg' },
    '.chakra-ui-dark &': {
      border: '1px solid',
      borderColor: colors.borderDark,
    },
  },
  'no-border-hover': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'translateY(-4px)', shadow: 'lg' },
    '.chakra-ui-dark &': { bg: colors.neutralDarker },
  },

  // With Zoom transform on hover
  'solid-hover3': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    border: '1px solid',
    borderColor: colors.borderLight,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'scale(1.05)' },
    '.chakra-ui-dark &': {
      bg: colors.neutralDarker,
      border: '1px solid',
      borderColor: colors.borderDark,
    },
  },
  'outline-hover3': {
    p: '1.5rem',
    border: '1px solid',
    borderRadius: borderRadius,
    borderColor: colors.borderLight,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'scale(1.05)' },
    '.chakra-ui-dark &': { borderColor: colors.borderDark },
  },
  'no-border-hover3': {
    p: '1.5rem',
    bg: colors.neutralLighter,
    borderRadius: borderRadius,
    transition: 'all 0.3s',
    'transition-timing-function': 'spring(1 100 10 10)',
    _hover: { transform: 'scale(1.05)' },
    '.chakra-ui-dark &': { bg: colors.neutralDarker },
  },
};

export default layerStyles;
