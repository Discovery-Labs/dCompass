import { useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import useCustomColor from "core/hooks/useCustomColor";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsGlobe } from "react-icons/bs";
import { SiDiscord, SiGithub, SiTwitter } from "react-icons/si";
import { REQUIRED_FIELD_LABEL } from "../../core/constants";
import { Tag } from "../../core/types";
import { ALL_TAGS_QUERY } from "../../graphql/tags";
import ControlledSelect from "../Inputs/ControlledSelect";
import LogoDropzone from "./LogoDropzone";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});
const CreateProjectForm = () => {
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();
  const { data, loading, error } = useQuery(ALL_TAGS_QUERY);
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext();

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
      <Heading>Create project</Heading>
      <LogoDropzone
        {...{ register, setValue, getValues, errors, isRequired: true }}
      />

      {/* <FormControl isInvalid={!!errors.logo}>
        <FormLabel htmlFor="logo">Logo</FormLabel>

        <Input type="file" placeholder="Logo" {...register("logo")} />

        <FormErrorMessage>
          {errors.logo && errors.logo.message}
        </FormErrorMessage>
      </FormControl> */}

      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">Project name</FormLabel>
        <Input
          placeholder="Project name"
          {...register("name", {
            required: REQUIRED_FIELD_LABEL,
            maxLength: {
              value: 80,
              message: "Maximum length should be 80",
            },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.slogan}>
        <FormLabel htmlFor="slogan">Short Description</FormLabel>
        <Input
          placeholder="Slogan"
          {...register("slogan", {
            required: REQUIRED_FIELD_LABEL,
            maxLength: {
              value: 180,
              message: "Maximum length should be 180",
            },
          })}
        />
        <FormErrorMessage>
          {errors.slogan && errors.slogan.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel htmlFor="description">Markdown Description</FormLabel>
        <CodeEditor
          value={code}
          language="markdown"
          placeholder="Project description"
          {...register("description", {
            required: REQUIRED_FIELD_LABEL,
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

      <ControlledSelect
        control={control}
        name="tags"
        id="tags"
        label="Tags"
        isMulti
        rules={{
          required: REQUIRED_FIELD_LABEL,
        }}
        options={data.getAllTags.map(({ id, color, label }: Tag) => ({
          value: id,
          colorScheme: color,
          label,
        }))}
      />

      <VStack align="flex-start">
        <FormControl isInvalid={!!errors.website}>
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

        <FormControl isInvalid={!!errors.twitter}>
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

        <FormControl isInvalid={!!errors.discord}>
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

        <FormControl isInvalid={!!errors.github}>
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

export default CreateProjectForm;
