import { useWeb3React } from "@web3-react/core";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import NotConnectedCard from "../../../components/custom/NotConnectedCard";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import CoursesForm from "../../../components/projects/courses/CoursesForm";
import { Web3Context } from "../../../contexts/Web3Provider";
import Card from "components/custom/Card";

function CreateCourseStepper() {
  const { contracts } = useContext(Web3Context);
  const web3React = useWeb3React();

  const { account } = web3React;

  const methods = useForm({
    defaultValues: {
      courses: [
        {
          question: "Genesis",
          options: ["0x0000000000000"],
        },
      ],
    },
  });

  return account && contracts ? (
    <FormProvider {...methods}>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <CoursesForm />
        </Card>
      </CenteredFrame>
    </FormProvider>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
}

export default CreateCourseStepper;
