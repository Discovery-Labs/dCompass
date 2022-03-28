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
    colors.accentLight[500],
    colors.accentDark[500]
  );
  const getColoredText = useColorModeValue(
    colors.neutralDark,
    colors.neutralLight
  );
  const accentColorScheme = useColorModeValue("accentLight", "accentDark");

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
    getPrimaryColor,
    getOverBgColor,
    getAccentColor,
    getColoredText,
    accentColorScheme,
    codeEditorScheme,
    codeEditorPreviewScheme,
    getTextColor,
    getBgColor,
    getBorderColor,
  };
}

export default useCustomColor;
