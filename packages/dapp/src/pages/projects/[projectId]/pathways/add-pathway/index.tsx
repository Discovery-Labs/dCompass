import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link, Box } from "@chakra-ui/react";
import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import PathwayFormWrapper from "components/projects/pathways/PathwayFormWrapper";
import useCustomColor from "core/hooks/useCustomColor";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import NextLink from "next/link";

function AddPathwayStepper() {
  const { getPrimaryColor } = useCustomColor();
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Box w="full" py="1">
            <NextLink href={"/"} passHref>
              <Link
                textStyle={"small"}
                color="text"
                _hover={{ color: getPrimaryColor, textDecoration: "none" }}
                onClick={() => router.back()}
              >
                <ChevronLeftIcon w={6} h={6} />
                Back to Project
              </Link>
            </NextLink>
          </Box>
          <Card layerStyle="solid-card" h="full" w="full">
            <PathwayFormWrapper />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddPathwayStepper;
