import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";

function MenuDropdown() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   const moreLink =
  //     "https://discoverydao.notion.site/discoverydao/Discovery-DAO-33c1ab96a7e04865bb0b8a29d66ee0e6";

  return (
    <>
      <Menu isOpen={isOpen}>
        <MenuButton
          as={Link}
          color={"text-weak"}
          _hover={{ color: "text", textDecoration: "none" }}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          rightIcon={<ChevronDownIcon />}
        >
          More {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </MenuButton>
        <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
          <MenuItem>Contribute</MenuItem>
          <MenuItem>Docs</MenuItem>
          <MenuItem>Github</MenuItem>
          <MenuItem>Discord</MenuItem>
          <MenuItem>Twitter</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default MenuDropdown;
