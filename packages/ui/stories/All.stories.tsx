import React from 'react';
import { Meta, Story } from '@storybook/react';

import { ColorModeToggleBar } from './ColorMode';

import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Center,
  Flex,
  useTheme,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Skeleton,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Icon,
} from '@chakra-ui/react';

const meta: Meta = {
  title: 'All',
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const All = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <VStack>
        <ColorModeToggleBar />

        {/* Buttons Primary Variants */}
        <HStack>
          <Button onClick={() => console.log('hello')}>Primary</Button>
          <Button variant="outline">Primary</Button>
          <Button variant="ghost">Primary</Button>
          <IconButton
            aria-label="Search database"
            icon={<Icon as={FaSearch} />}
          />
        </HStack>

        {/* Buttons Secondary Variants */}
        <HStack>
          <Button colorScheme="secondary" onClick={() => console.log('hello')}>
            Secondary
          </Button>
          <Button colorScheme="secondary" variant="outline">
            Secondary
          </Button>
          <Button colorScheme="secondary" variant="ghost">
            Secondary
          </Button>
        </HStack>

        {/* Buttons Secondary Variants */}
        <HStack>
          <Button colorScheme="accent" onClick={() => console.log('hello')}>
            Accent
          </Button>
          <Button colorScheme="accent" variant="outline">
            Accent
          </Button>
          <Button colorScheme="accent" variant="ghost">
            Accent
          </Button>
        </HStack>

        {/* Buttons Custom Styles */}
        <Button layerStyle="gradient-bg">Gradient</Button>
        <Button colorScheme="white">Gradient</Button>

        {/* Heading and Text */}
        <Heading>Heading</Heading>
        <Text as="h1" textStyle="h1" fontWeight="bold" color="primary">
          Hello world with Text
        </Text>

        {/* Semantic Tokens */}
        <Box padding="8" bgColor="bg">
          <Text color="text">Semantic Colors</Text>
          <Text color="text-weak">Semantic Colors</Text>
          <Text color="primary">Semantic Colors</Text>
          <Text color="accent">Semantic Colors</Text>
          <Box
            padding="8"
            borderWidth="2px"
            borderColor="border"
            bgColor="bg-medium"
          >
            <Text color="text">Semantic Colors</Text>
          </Box>
        </Box>

        {/* Layer Styles */}
        <Divider />
        <HStack>
          <Box layerStyle="gradient-border">
            <Center boxSize="150px" layerStyle="solid-card">
              <Text color="text-weak">Accent Text in Card</Text>
            </Center>
          </Box>
          <Center boxSize="150px" layerStyle="outline-card">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="no-border-card">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
        </HStack>
        <HStack>
          <Center boxSize="150px" layerStyle="solid-hover">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="outline-hover">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="no-border-hover">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
        </HStack>
        <HStack>
          <Center boxSize="150px" layerStyle="solid-hover2">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="outline-hover2">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="no-border-hover2">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
        </HStack>
        <HStack>
          <Center boxSize="150px" layerStyle="solid-hover3">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="outline-hover3">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
          <Center boxSize="150px" layerStyle="no-border-hover3">
            <Text color="text-weak">Accent Text in Card</Text>
          </Center>
        </HStack>

        {/* Text Styles */}
        <Text textStyle="h1">
          Lorem ipsum dolor sit amet,
          <Box as="span" layerStyle="gradient-text">
            {' '}
            consetetur{' '}
          </Box>
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua.
        </Text>
        <Text textStyle="h2" color="text-weak">
          Lorem ipsum dolor sit amet, sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua.
        </Text>
        <Text textStyle="p">
          Lorem ipsum dolor sit amet, sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua.
        </Text>
        <Text textStyle="small" color="text-weak">
          Lorem ipsum dolor sit amet, sadipscing elitr, sed diam nonumy eirmod
          tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua.
        </Text>
        <Text textStyle="glow">
          Lorem ipsum dolor sit amet, sadipscing elitr
        </Text>

        {/* Issue with framer-motion solved with next chakra-ui release 1.8.8 */}
        {/* <Switch /> */}
        {/* <Checkbox /> */}

        {/* Tags */}
        <HStack>
          <Text>Tags</Text>
          <Tag>hello</Tag>
          <Tag colorScheme="blue">hello</Tag>
          <Tag variant="solid" colorScheme="green">
            hello
          </Tag>
          <Tag variant="outline" colorScheme="teal">
            hello
          </Tag>
          <Tag variant="subtle" colorScheme="teal">
            hello
          </Tag>
        </HStack>

        {/* Badges */}
        <HStack>
          <Text>Badges</Text>
          <Badge>hello</Badge>
          <Badge colorScheme="teal">hello</Badge>
        </HStack>

        {/* Drawer */}
        <Button onClick={onOpenDrawer}>Open Drawer</Button>
        <Drawer isOpen={isOpenDrawer} placement="left" onClose={onCloseDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onCloseDrawer}>
                Cancel
              </Button>
              <Button>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Toast */}
        <Button
          onClick={() =>
            toast({
              title: 'Account created.',
              description: "We've created your account for you.",
              status: 'success',
              duration: 9000,
              isClosable: true,
            })
          }
        >
          Show Toast
        </Button>

        {/* Modal */}
        <>
          <Button onClick={onOpen}>Trigger modal</Button>

          <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Lorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem
                ipsum
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>

        {/* Popover */}
        <Popover>
          <PopoverTrigger>
            <Button>Trigger Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Confirmation!</PopoverHeader>
            <PopoverBody>
              Are you sure you want to have that milkshake?
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Tabs */}
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Tabs variant="unstyled">
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Tabs variant="line">
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Link */}
        <Link isExternal>
          Link <Icon as={FaExternalLinkAlt} mx="2px" />
        </Link>

        {/* Menu */}
        {/* <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem icon={<AddIcon />} command="⌘T">
              New Tab
            </MenuItem>
            <MenuItem command="⌘N">New Window</MenuItem>
            <MenuItem>Open Closed Tab</MenuItem>
            <MenuDivider />
            <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
              <MenuItemOption value="asc">Ascending</MenuItemOption>
              <MenuItemOption value="desc">Descending</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu> */}

        {/* Inputs */}
        <Input />
        <Select placeholder="Select option"></Select>
        <Textarea placeholder="Select option"></Textarea>

        {/* FormControls */}
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <FormControl id="email" isInvalid>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <HStack justify="space-between">
          <Box layerStyle="solid-card">
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
          </Box>

          <Box layerStyle="outline-card">
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
          </Box>
        </HStack>

        <FormControl id="email" isRequired>
          <FormLabel as="legend">Favorite Naruto Character</FormLabel>
          <RadioGroup defaultValue="Itachi">
            <HStack spacing="24px">
              <Radio value="Sasuke">Sasuke</Radio>
              <Radio value="Nagato">Nagato</Radio>
              <Radio value="Itachi">Itachi</Radio>
              <Radio value="Sage of the six Paths">Sage of the six Paths</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl id="email">
          <FormLabel>Amount</FormLabel>
          <NumberInput max={50} min={10}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        {/* Accordion */}
        <Box layerStyle="outline-card" p="0" w="full">
          <Accordion w="full" allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 1 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Section 2 title
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        {/* Tables */}
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </VStack>
    </>
  );
};
