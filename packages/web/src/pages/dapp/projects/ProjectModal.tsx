import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

function ProjectModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Button onClick={onOpen}>Create Project</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="brand.900">
          <ModalHeader>Create your project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={initialRef} placeholder="Project name" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input placeholder="Description" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Github</FormLabel>
              <Input placeholder="Github" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Website</FormLabel>
              <Input placeholder="Website" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Twitter</FormLabel>
              <Input placeholder="Twitter" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Logo</FormLabel>
              <Input placeholder="Logo" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>OG Image</FormLabel>
              <Input placeholder="OG Image" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProjectModal;
