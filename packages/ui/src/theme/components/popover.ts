import { popoverAnatomy as parts } from "@chakra-ui/anatomy"
import type {
  PartsStyleFunction,
  SystemStyleFunction,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"
import { cssVar, mode } from "@chakra-ui/theme-tools"
import useThemeColor from "../../hooks/useThemeColor";

const $popperBg = cssVar("popper-bg")

const $arrowBg = cssVar("popper-arrow-bg")
const $arrowShadowColor = cssVar("popper-arrow-shadow-color")

const baseStylePopper: SystemStyleObject = {
  zIndex: 10,
}

const baseStyleContent: SystemStyleFunction = (props) => {
  const { getBgColor, getOverBgColor } = useThemeColor();
  const bg = mode("white", "gray.700")(props)
  const shadowColor = mode("gray.200", "whiteAlpha.300")(props)

  return {
    [$popperBg.variable]: `colors.${bg}`,
    bg: getBgColor(props),
    [$arrowBg.variable]: $popperBg.reference,
    [$arrowShadowColor.variable]: `colors.${shadowColor}`,
    width: "xs",
    border: "1px solid",
    borderColor: getOverBgColor(props),
    borderRadius: "md",
    boxShadow: "sm",
    zIndex: "inherit",
    _focus: {
      boxShadow: 'none',
    },
    // _focus: {
    //   outline: 0,
    //   boxShadow: "outline",
    // },
  }
}

const baseStyleHeader: SystemStyleObject = {
  px: 3,
  py: 2,
  borderBottomWidth: "1px",
}

const baseStyleBody: SystemStyleObject = {
  px: 3,
  py: 2,
}

const baseStyleFooter: SystemStyleObject = {
  px: 3,
  py: 2,
  borderTopWidth: "1px",
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  popper: baseStylePopper,
  content: baseStyleContent(props),
  header: baseStyleHeader,
  body: baseStyleBody,
  footer: baseStyleFooter,
  arrow: {},
})

export default {
  parts: parts.keys,
  baseStyle,
}
