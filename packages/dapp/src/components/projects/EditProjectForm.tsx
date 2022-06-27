import { useQuery } from "@apollo/client";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import useCustomColor from "core/hooks/useCustomColor";
import { useState, useEffect } from "react";

import CodeEditorPreview from "components/custom/CodeEditorPreview";
import { Tag } from "../../core/types";
import { ALL_TAGS_QUERY } from "../../graphql/tags";
import ControlledSelect from "../Inputs/ControlledSelect";

import LogoDropzone from "./LogoDropzone";
import { BsGlobe } from "react-icons/bs";
import { SiTwitter, SiDiscord, SiGithub } from "react-icons/si";
import { REQUIRED_FIELD_LABEL } from "../../core/constants";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});
const EditProjectForm: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext();
  const { data, loading, error } = useQuery(ALL_TAGS_QUERY);

  useEffect(() => {
    const descriptionValues = getValues("description");

    if (descriptionValues) {
      setCode(descriptionValues);
    }
  }, [getValues]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  return (
    <>
      <Heading>Edit project</Heading>
      <LogoDropzone {...{ register, setValue, errors }} />

      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Project name</FormLabel>
        <Input
          placeholder="Project name"
          {...register("name", {
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description">Description</FormLabel>

        <CodeEditor
          value={code}
          language="markdown"
          placeholder="Project description"
          {...register("description", {
            maxLength: {
              value: 1200,
              message: "Maximum length should be 1200",
            },
          })}
          onChange={(e) => {
            const { name } = e.target;
            setCode(e.target.value);
            setValue(name, e.target.value);
          }}
          style={{
            fontSize: "16px",
          }}
          className={codeEditorScheme}
          padding={15}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>

      {code && <CodeEditorPreview code={code} />}

      <FormControl isInvalid={errors.website}>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Input
          placeholder="Website"
          {...register("website", {
            maxLength: {
              value: 50,
              message: "Maximum length should be 50",
            },
          })}
        />
        <FormErrorMessage>
          {errors.website && errors.website.message}
        </FormErrorMessage>
      </FormControl>

      <ControlledSelect
        control={control}
        name="tags"
        id="tags"
        label="Tags"
        isMulti
        rules={{
          required: "This is required",
        }}
        options={data.getAllTags.map(({ id, color, label }: Tag) => ({
          value: id,
          colorScheme: color,
          label,
        }))}
      />

      <VStack align="flex-start">
        <FormControl isInvalid={errors.website}>
          <FormLabel htmlFor="website">Website</FormLabel>
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <Icon as={BsGlobe} />
            </InputRightElement>
            <InputLeftAddon>
              <Text>https://</Text>
            </InputLeftAddon>
            <Input
              placeholder="website.xyz"
              {...register("website", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 50,
                  message: "Maximum length should be 50",
                },
              })}
            />
          </InputGroup>

          <FormErrorMessage>
            {errors.website && errors.website.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.twitter}>
          <FormLabel htmlFor="twitter">Twitter</FormLabel>
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <Icon as={SiTwitter} />
            </InputRightElement>
            <InputLeftAddon>
              <Text>https://twitter.com/</Text>
            </InputLeftAddon>
            <Input
              placeholder="your_handle"
              {...register("twitter", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 50,
                  message: "Maximum length should be 50",
                },
              })}
            />
          </InputGroup>

          <FormErrorMessage>
            {errors.twitter && errors.twitter.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.discord}>
          <FormLabel htmlFor="discord">Discord</FormLabel>
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <Icon as={SiDiscord} />
            </InputRightElement>
            <InputLeftAddon>
              <Text>https://discord.gg/</Text>
            </InputLeftAddon>
            <Input
              placeholder="discord_invite_code"
              {...register("discord", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 50,
                  message: "Maximum length should be 50",
                },
              })}
            />
          </InputGroup>

          <FormErrorMessage>
            {errors.discord && errors.discord.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.github}>
          <FormLabel htmlFor="github">Github</FormLabel>
          <InputGroup>
            <InputRightElement pointerEvents="none">
              <Icon as={SiGithub} />
            </InputRightElement>
            <InputLeftAddon>
              <Text>https://github.com/</Text>
            </InputLeftAddon>
            <Input
              placeholder="organisation or project repository"
              {...register("github", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 50,
                  message: "Maximum length should be 50",
                },
              })}
            />
          </InputGroup>

          <FormErrorMessage>
            {errors.github && errors.github.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </>
  );
};

export default EditProjectForm;
