import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";

import useCustomColor from "core/hooks/useCustomColor";

type IconWithStateProps = {
  icon: string;
  active?: boolean;
  label: string;
  placeholder: string;
};

function IconWithState({
  icon,
  active = false,
  label,
  placeholder,
}: IconWithStateProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getPrimaryColor, getTextColor } = useCustomColor();

  const {
    register,
    formState: { errors },
  } = useFormContext();

  let SiIcon;
  switch (icon) {
    case "discord":
      SiIcon = SiDiscord;
      break;
    case "gitbook":
      SiIcon = SiGitbook;
      break;
    case "github":
      SiIcon = SiGithub;
      break;
    case "twitter":
      SiIcon = SiTwitter;
      break;
    default:
      SiIcon = SiDiscord;
  }

  return (
    <>
      <IconButton
        variant="unstyled"
        aria-label="Social medias and resources"
        w="8"
        h="8"
        as={SiIcon}
        onClick={onOpen}
        color={getTextColor}
        _hover={{ color: getPrimaryColor }}
      />
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Social medias &amp; resources</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full">
              <FormControl isInvalid={errors[icon]}>
                <FormLabel htmlFor={icon}>{label}</FormLabel>
                <Input
                  placeholder={placeholder}
                  {...register(icon, {
                    required: "This is required",
                    maxLength: {
                      value: 150,
                      message: "Maximum length should be 150",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors[icon] && errors[icon].message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default IconWithState;
