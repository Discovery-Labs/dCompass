import { useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import useCustomColor from "core/hooks/useCustomColor";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { REQUIRED_FIELD_LABEL } from "../../core/constants";
import { Tag } from "../../core/types";
import { ALL_TAGS_QUERY } from "../../graphql/tags";
import IconWithState from "../custom/IconWithState";
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

      {/* <FormControl isInvalid={errors.logo}>
        <FormLabel htmlFor="logo">Logo</FormLabel>

        <Input type="file" placeholder="Logo" {...register("logo")} />

        <FormErrorMessage>
          {errors.logo && errors.logo.message}
        </FormErrorMessage>
      </FormControl> */}

      <FormControl isInvalid={errors.name}>
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

      <FormControl isInvalid={errors.slogan}>
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

      <FormControl isInvalid={errors.description}>
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

      <FormControl isInvalid={errors.website}>
        <FormLabel htmlFor="website">Website</FormLabel>
        <InputGroup>
          <InputLeftAddon>
            <Text>https://</Text>
          </InputLeftAddon>
          <Input
            placeholder="Website"
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

      {/* <FormControl isInvalid={errors.whitepaper}>
        <FormLabel htmlFor="whitepaper">Whitepaper</FormLabel>
        <Input
          placeholder="Whitepaper"
          {...register("whitepaper", {
            required: REQUIRED_FIELD_LABEL,
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.whitepaper && errors.whitepaper.message}
        </FormErrorMessage>
      </FormControl> */}

      <FormControl isInvalid={errors.twitter}>
        <FormLabel htmlFor="twitter">Twitter</FormLabel>
        <Input
          placeholder="Twitter account url"
          {...register("twitter", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.twitter && errors.twitter.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.discord}>
        <FormLabel htmlFor="discord">Discord</FormLabel>
        <Input
          placeholder="Discord account url"
          {...register("discord", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.discord && errors.discord.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.gitbook}>
        <FormLabel htmlFor="gitbook">Gitbook</FormLabel>
        <Input
          placeholder="Gitbook account url"
          {...register("gitbook", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.gitbook && errors.gitbook.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.github}>
        <FormLabel htmlFor="github">Github</FormLabel>
        <Input
          placeholder="Github account url"
          {...register("github", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.github && errors.github.message}
        </FormErrorMessage>
      </FormControl>

      {/*  
        Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
        1. You might have mismatching versions of React and the renderer (such as React DOM)
        2. You might be breaking the Rules of Hooks
        3. You might have more than one copy of React in the same app
        See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.
      */}
      {/* <Flex p="4" w="full" justify="space-around">
        <IconWithState
          icon="twitter"
          label="Twitter"
          active={!!currentValues.twitter}
          placeholder="Twitter account url"
        />
        <IconWithState
          icon="discord"
          active={!!currentValues.discord}
          label="Discord"
          placeholder="Discord server invite url"
        />
        <IconWithState
          icon="gitbook"
          active={!!currentValues.gitbook}
          label="Gitbook"
          placeholder="Gitbook repository url"
        />
        <IconWithState
          icon="github"
          active={!!currentValues.github}
          label="Github"
          placeholder="Github organization url"
        />
      </Flex> */}
    </>
  );
};

export default CreateProjectForm;
