import { Heading, HStack, Icon, VStack } from "@chakra-ui/react";
import { BsPeople, BsPerson } from "react-icons/bs";
import MemberAddress from "components/custom/MemberAddress";
import { useTranslation } from "next-i18next";
import useCustomColor from "core/hooks/useCustomColor";

interface MembersAddressProps {
  squad: any;
}

function MembersAddress(props: MembersAddressProps) {
  const { squad } = props;
  const { t } = useTranslation("common");
  const { getTextColor } = useCustomColor();

  return (
    <>
      <HStack>
        <Icon as={squad.members.length > 1 ? BsPeople : BsPerson} />
        <Heading
          as="h4"
          size="md"
          textTransform="uppercase"
          color={getTextColor}
        >
          {squad.members.length} {t("member")}
          {squad.members.length > 1 ? "s" : ""}
        </Heading>
      </HStack>
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
    </>
  );
}

export default MembersAddress;
