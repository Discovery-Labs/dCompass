import { useQuery } from "@apollo/client";
import {
  Flex,
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
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import CodeEditorPreview from "components/custom/CodeEditorPreview";
import useCustomColor from "core/hooks/useCustomColor";
import { Tag } from "../../core/types";
import { ALL_TAGS_QUERY } from "../../graphql/tags";
import IconWithState from "../custom/IconWithState";
import ControlledSelect from "../Inputs/ControlledSelect";

import LogoDropzone from "./LogoDropzone";

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
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const { data, loading, error } = useQuery(ALL_TAGS_QUERY);

  const currentValues = watch();

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

      <FormControl isInvalid={errors.whitepaper}>
        <FormLabel htmlFor="whitepaper">Whitepaper</FormLabel>
        <Input
          placeholder="Whitepaper"
          {...register("whitepaper", {
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.whitepaper && errors.whitepaper.message}
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

      <Flex p="4" w="full" justify="space-around">
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
      </Flex>
    </>
  );
};

export default EditProjectForm;
