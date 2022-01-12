import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  CheckboxGroup,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { BiWorld } from "react-icons/bi";

const LanguageButton = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const changeLocale = (locale: string) => {
    router.push(router.pathname, router.pathname, { locale });
  };

  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<BiWorld />}
          aria-label="Filter"
          variant="outline"
        />
        <CheckboxGroup
        // onChange={(e: Array<string>) => filterWithTags(e)}
        // defaultValue={fiterTags}
        >
          <MenuList>
            <MenuItem onClick={() => changeLocale("en")}>
              <Text>{t("english")}</Text>
            </MenuItem>
            <MenuItem onClick={() => changeLocale("it")}>
              <Text>{t("italian")}</Text>
            </MenuItem>
          </MenuList>
        </CheckboxGroup>
      </Menu>
    </>
  );
};

export default LanguageButton;
