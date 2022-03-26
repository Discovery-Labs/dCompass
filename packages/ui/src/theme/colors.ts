import { DeepPartial, Theme } from '@chakra-ui/react';

interface ExtendedColors {
  neutralDarkest: string;
  neutralDarker: string;
  neutralDark: string;
  neutralLightest: string;
  neutralLighter: string;
  neutralLight: string;
  borderDark: string;
  borderLight: string;

  neutralDarkerAlpha: string;
  neutralLighterAlpha: string;

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
  accentDark: {
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
  accentLight: {
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
  neutralDarker: '#18112C',
  neutralDark: '#513B91',
  neutralLightest: '#EFEDF5',
  neutralLighter: '#fff',
  neutralLight: '#AFA2D6',

  neutralDarkerAlpha: '#1a2227b3',
  neutralLighterAlpha: '#f0f0f0b3',

  borderDark: '#6F3FF5',
  borderLight: '#6F3FF5',

  // Functional
  success: '#9AF1A8',
  error: '#F86D97',

  // Main
  primary: {
    50: '#eee9fe',
    100: '#cab8fb',
    200: '#8C65F7', // purplelight
    300: '#6F3FF5', // purple
    400: '#5932C4', // purpledark
    500: '#6F3FF5',
    600: '#4b0ff2',
    700: '#420bdc',
    800: '#3b0ac4',
    900: '#2d0893',
  },
  secondary: {
    50: '#ffffff',
    100: '#fccfdf',
    200: '#F579A6', // pinklight
    300: '#F35890', // pink
    400: '#D44D6E', // pinkdark
    500: '#F35890',
    600: '#f02870',
    700: '#ed1161',
    800: '#d60f57',
    900: '#a60c44',
  },
  accentDark: {
    50: '#98fee6',
    100: '#66fed9',
    200: '#5BF1CD', // aqualight
    300: '#02E2AC', // aqua
    400: '#11BC92', // aquadark
    500: '#02E2AC',
    600: '#02af86',
    700: '#019672',
    800: '#017d5f',
    900: '#014a39',
  },
  accentLight: {
    50: '#98fee6',
    100: '#66fed9',
    200: '#5BF1CD', // aqualight
    300: '#02E2AC', // aqua
    400: '#11BC92', // aquadark
    500: '#02E2AC',
    600: '#02af86',
    700: '#019672',
    800: '#017d5f',
    900: '#014a39',
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme['colors']> = {};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
