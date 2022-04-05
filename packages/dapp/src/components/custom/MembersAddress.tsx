import {
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { BsPeople, BsPerson } from "react-icons/bs";
import MemberAddress from "components/custom/MemberAddress";
import { useTranslation } from "next-i18next";
import useCustomColor from "core/hooks/useCustomColor";

interface MembersAddressProps {
  squad: any;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function MembersAddress(props: MembersAddressProps) {
  const { squad } = props;
  const { t } = useTranslation("common");
  const { getTextColor } = useCustomColor();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack onClick={onOpen} cursor="pointer">
        <Icon as={squad.members.length > 1 ? BsPeople : BsPerson} />
        <Heading as="h4" size="md" textTransform="uppercase" color="text">
          {squad.members.length} {t("member")}
          {squad.members.length > 1 ? "s" : ""}
        </Heading>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform="uppercase">
            {squad.name} - {squad.members.length} {t("member")}
            {squad.members.length > 1 ? "s" : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="center" maxW="full">
              {squad.members.map(
                (member: string) =>
                  member && (
                    <HStack w="full">
                      <MemberAddress
                        address={member}
                        value={member}
                        fontSize="18px"
                        size="short"
                      />
                    </HStack>
                  )
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MembersAddress;
