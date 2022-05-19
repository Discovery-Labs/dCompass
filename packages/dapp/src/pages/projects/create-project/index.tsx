import { useMutation } from "@apollo/client";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Link, Stack, useToast } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { SponsorPassSFT } from "@discovery-dao/hardhat/typechain-types/SponsorPassSFT";
import { useWeb3React } from "@web3-react/core";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import useCustomColor from "core/hooks/useCustomColor";
import { isAddress } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ThreeTierPricing from "../../../components/custom/Pricing";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import CreateProjectForm from "../../../components/projects/CreateProjectForm";
import SquadsForm from "../../../components/projects/squads/SquadsForm";
import { Web3Context } from "../../../contexts/Web3Provider";
import { CREATE_PROJECT_MUTATION } from "../../../graphql/projects";
// import { schemaAliases } from "../../../core/ceramic";

// const { PROJECTS_ALIAS } = schemaAliases;
const CreateProject = <CreateProjectForm />;
const CreateSquads = <SquadsForm />;
const Pricing = <ThreeTierPricing />;

const steps = [
  {
    label: "Step 1",
    content: CreateProject,
  },
  { label: "Step 2", content: CreateSquads },
  { label: "Step 3", content: Pricing },
];

function CreateProjectStepper() {
  const toast = useToast();
  const { getPrimaryColor } = useCustomColor();
  const { t } = useTranslation("common");
  const router = useRouter();
  const { self } = useContext(Web3Context);
  const { account } = useWeb3React();
  const { contracts } = useContext(Web3Context);
  const [projectNFTContract, setProjectNFTContract] = useState<ProjectNFT>();
  const [sponsorPassSFT, setSponsorPassSFT] = useState<SponsorPassSFT>();

  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION, {
    refetchQueries: "all",
  });
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const methods = useForm({
    defaultValues: {
      name: null,
      logo: null,
      description: null,
      squads: [
        {
          name: "Genesis",
          members: ["0x0000000000000"],
          image: null,
        },
      ],
      tags: [] as {
        value: string;
        label: string;
      }[],
      website: null,
      discord: null,
      gitbook: null,
      github: null,
      twitter: null,
      sponsorTier: "GOLD" as "SILVER" | "GOLD" | "DIAMOND",
      projectWallet: null as null | string,
    },
  });

  useEffect(() => {
    async function init() {
      if (contracts) {
        setProjectNFTContract(contracts.projectNFTContract);
        setSponsorPassSFT(contracts.SponsorPassSFT);
      }
    }
    init();
  }, [contracts]);

  async function onSubmit() {
    const values = methods.getValues();
    console.log({ values });
    if (!projectNFTContract) {
      throw new Error("ProjectNFTContract not deployed on this network");
    }
    if (!sponsorPassSFT) {
      throw new Error("SponsorPassSFT not deployed on this network");
    }

    if (!values.projectWallet || !isAddress(values.projectWallet)) {
      throw new Error("Not a valid project wallet address");
    }

    const formData = new FormData();
    if (values.logo) {
      const logo = values.logo[0] as any;
      formData.append("logo", logo, logo.name);
    }
    values.squads.forEach((squad) => {
      if (squad.image) {
        const squadImage = squad.image[0] as any;
        formData.append(squad.name, squad.image[0], squadImage.name);
      }
    });

    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });
    const { cids } = await cidsRes.json();

    console.log({ cids });

    const serializedProject = {
      ...values,
      logo: cids.logo,
      website: `https://${values.website}`,
      createdBy: account,
      tags: values.tags.map((tag) => ({ id: tag.value })),
      squads: values.squads.map((squad) => {
        const members = squad.members.map(
          (member: any) => member.value
        ) as string[];
        return {
          ...squad,
          image: cids[squad.name],
          members,
        };
      }),
    };

    const newProjectDoc = await self.client.dataModel.createTile(
      "Project",
      { ...serializedProject, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    console.log({ cnt: newProjectDoc.content });

    const projectId = newProjectDoc.id.toUrl();
    formData.append(
      "metadata",
      JSON.stringify({
        projectId,
        ...newProjectDoc.content,
      })
    );

    const nftCidRes = await fetch("/api/squad-nft-storage", {
      method: "POST",
      body: formData,
    });

    const { metadataCids } = await nftCidRes.json();

    const stakeAmountsIndex = {
      SILVER: 1,
      GOLD: 2,
      DIAMOND: 3,
    };

    const stakeAmounts = await sponsorPassSFT.stakeAmounts(
      stakeAmountsIndex[values.sponsorTier]
    );

    await projectNFTContract.addProjectWallet(
      projectId,
      values.projectWallet,
      values.sponsorTier,
      {
        value: stakeAmounts,
      }
    );

    const allProjects = await createProjectMutation({
      variables: {
        input: {
          id: projectId,
          tokenUris: metadataCids,
        },
      },
    });
    toast({
      title: "Project submitted!",
      description: `Your project will be reviewed soon!`,
      status: "success",
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
      variant: "subtle",
    });
    return router.push("/");
  }

  const nextStepWithValidation = async () => {
    const { trigger } = methods;

    let isValid = false;

    switch (activeStep) {
      case 0:
        isValid = await trigger([
          "name",
          "logo",
          "description",
          "website",
          "tags",
          "discord",
          "gitbook",
          "github",
          "twitter",
        ]);
        break;
      case 1:
        isValid = await trigger([
          `squads.${0}.name`,
          `squads.${0}.members.${0}`,
          `squads.${0}.image`,
        ]);
        break;
    }

    if (isValid) {
      nextStep();
    }
  };

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
              >
                <ChevronLeftIcon w={6} h={6} />
                Back to projects
              </Link>
            </NextLink>
          </Box>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Steps
                w="full"
                orientation="horizontal"
                responsive={false}
                colorScheme="purple"
                activeStep={activeStep}
              >
                {steps.map(({ label, content }) => (
                  <Step key={label}>{content}</Step>
                ))}
              </Steps>
              <Flex w="full" justify="center">
                {activeStep > 0 && activeStep <= 2 && (
                  <Button
                    variant="outline"
                    onClick={() => prevStep()}
                    px="1.25rem"
                    fontSize="md"
                  >
                    {t("prev")}
                  </Button>
                )}
                {activeStep < 2 && (
                  <Button
                    ml="0.5rem"
                    onClick={() => nextStepWithValidation()}
                    px="1.25rem"
                    fontSize="md"
                  >
                    {t("next")}
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    ml="0.5rem"
                    // colorScheme="accentDark"
                    isLoading={methods.formState.isSubmitting}
                    type="submit"
                    px="1.25rem"
                    fontSize="md"
                  >
                    {t("submit")}
                  </Button>
                )}
              </Flex>
            </Stack>
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default CreateProjectStepper;
