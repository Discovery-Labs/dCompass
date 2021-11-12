import { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<Record<string, Theme["colors"]["current"]>> =
  {
    white: "#fff",
    space: "#0E0333",
    spacepink: "#301041",
    spacelight: "#1A103D",
    spacelightalpha: "rgba(255, 255, 255, 0.05)",
    stone: "#9B95B0",
    smoke: "#3B3058",
    purplelight: "#8C65F7",
    purple: "#6F3FF5",
    purpledark: "#5932C4",
    pinklight: "#F579A6",
    pink: "#F35890",
    pinkdark: "#D44D6E",
    aqualight: "#5BF1CD",
    aqua: "#02E2AC",
    aquadark: "#11BC92",
  };

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};

export default colors;
