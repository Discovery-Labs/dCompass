import { useColorModeValue } from "@chakra-ui/react";
import { colors } from "@discovery-dao/ui";

function useCustomColor() {
  const getPrimaryColor = useColorModeValue(
    colors.primary[500],
    colors.primary[200]
  );
  const getOverBgColor = useColorModeValue(
    colors.neutralLighter,
    colors.neutralDarker
  );
  const getAccentColor = useColorModeValue(
    colors.accent[500],
    colors.accent[500]
  );
  const getColoredText = useColorModeValue(
    colors.neutralDark,
    colors.neutralLight
  );
  const accentColorScheme = useColorModeValue("accent", "accent");

  const codeEditorPreviewScheme = useColorModeValue("light", "dark");

  const codeEditorScheme = useColorModeValue(
    "code-editor-light",
    "code-editor"
  );

  const getTextColor = useColorModeValue(
    colors.neutralDarkest,
    colors.neutralLightest
  );
  const getBgColor = useColorModeValue(
    colors.neutralLightest,
    colors.neutralDarkest
  );

  const getBorderColor = useColorModeValue(
    colors.borderDark,
    colors.borderLight
  );

  return {
    getBgColor,
    getOverBgColor,
    getBorderColor,
    getPrimaryColor,
    getAccentColor,
    getTextColor,
    getColoredText,
    accentColorScheme,
    codeEditorScheme,
    codeEditorPreviewScheme,
  };
}

export default useCustomColor;
