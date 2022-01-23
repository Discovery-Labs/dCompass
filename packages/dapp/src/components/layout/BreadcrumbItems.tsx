import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Icon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IoMdCompass } from "react-icons/io";

import useCustomColor from "../../core/hooks/useCustomColor";

function BreadcrumbItems({
  breadCrumbs,
}: {
  breadCrumbs: {
    label: string;
    href: string;
    isCurrentPage?: boolean;
  }[];
}) {
  const { getTextColor, getPrimaryColor } = useCustomColor();
  return (
    <HStack w="full" align="left" alignItems="center">
      <Icon as={IoMdCompass} />
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="purple.200" />}
      >
        {breadCrumbs.map(({ href, label, isCurrentPage = false }) => (
          <BreadcrumbItem isCurrentPage={isCurrentPage}>
            <NextLink href={href}>
              <BreadcrumbLink
                color={isCurrentPage ? getPrimaryColor : getTextColor}
              >
                {label}
              </BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </HStack>
  );
}

export default BreadcrumbItems;
