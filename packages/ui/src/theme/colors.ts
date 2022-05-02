import { DeepPartial, Theme } from '@chakra-ui/react';

interface ExtendedColors {
  neutralDarkest: string;
  neutralDarker: string;
  neutralDark: string;
  neutralLightest: string;
  neutralLighter: string;
  neutralLight: string;

  neutralDarkerAlpha: string;
  neutralLighterAlpha: string;

  borderDark: string;
  borderLight: string;

  // Functional
  success: string;
  error: string;

  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

/** extend additional color here */
const extendedColors: DeepPartial<
  Record<string, Theme['colors']['current' | 'purple']>
> &
  ExtendedColors = {
  // Basic
  neutralDarkest: '#0F0A1E',
  neutralDarker: '#220D55',
  neutralDark: '#513B91',
  neutralLightest: '#EFEDF5',
  neutralLighter: '#fff',
  neutralLight: '#AFA2D6',

  neutralDarkerAlpha: '#513B91b3',
  neutralLighterAlpha: '#AFA2D6b3',

  borderDark: '#6F3FF5',
  borderLight: '#6F3FF5',

  // Functional
  success: '#9AF1A8',
  error: '#F86D97',

  /**
   * Main
   * Generate your shades
   * https://colorkit.io/shades-tints
   */
  primary: {
    50: '#EDE7FE',
    100: '#C3AFFB',
    200: '#9977F8',
    300: '#6F3FF5', // dark main
    400: '#6137D8', // light main
    500: '#522EB8',
    600: '#432598',
    700: '#341C78',
    800: '#251358',
    900: '#160A38',
  },
  secondary: {
    50: '#FDE7EF',
    100: '#F9B8D0',
    200: '#F688B0',
    300: '#F35890', // dark main
    400: '#D24A7C', // light main
    500: '#B33E69',
    600: '#943256',
    700: '#752643',
    800: '#561A30',
    900: '#370E1D',
  },
  accent: {
    50: '#E6FFF9',
    100: '#9AF6E0',
    200: '#4EECC6',
    300: '#02E2AC', // dark main
    400: '#00C797', // light main
    500: '#00AA81',
    600: '#008D6B',
    700: '#007055',
    800: '#00533F',
    900: '#003629',
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme['colors']> = {};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
