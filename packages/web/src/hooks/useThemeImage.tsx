import { useColorModeValue } from "@chakra-ui/react";

function useCustomColor() {
  const getBgDots = useColorModeValue(
    "url(/images/dots-light.png)",
    "url(/images/dots.png)"
  );
  const getBgHero = useColorModeValue(
    "url(/images/hero-bg-light.png)",
    "url(/images/hero-bg.png)"
  );

  return {
    getBgDots,
    getBgHero,
  };
}

export default useCustomColor;
