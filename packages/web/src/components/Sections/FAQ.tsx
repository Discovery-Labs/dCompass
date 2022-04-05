import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import useCustomColor from "hooks/useCustomColor";

import Section from "components/layout/Section";

function FAQ() {
  const { getPrimaryColor, getColoredText } = useCustomColor();

  return (
    <Section>
      <Heading pb="8" w="max-content" layerStyle="gradient-text">
        FAQs
      </Heading>
      <Box layerStyle="outline-card" p="0" w="full">
        <Accordion w="full" allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">When will dCompass be available ?</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text color={getColoredText}>
                We will release the alpha version soon.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">What is the tech stack ?</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text color={getColoredText}>
                We are using Next.js &amp; TypeScript for our front-end. We
                choose Ceramic for our main data store in conjunction with
                Filecoin &amp; IPFS for file storage.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">
                  Which blockhain will dCompass run on ?
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text color={getColoredText}>
                The dApp will be available on the Ethereum mainnet and Polygon
                for the alpha version but we are planning to support chains like
                Solana, Avalanche as well as chains running on Substrate &amp;
                Tendermint in the future.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Is dCompass open source ?</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text color={getColoredText}>
                Yes, it is! We are looking for super shadowy coders &amp;
                talented Anons!
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Section>
  );
}

export default FAQ;
