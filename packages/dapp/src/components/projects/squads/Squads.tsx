import {
  Center,
  Divider,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
// import { useRouter } from "next/router";
import { useFieldArray } from "react-hook-form";

import MembersFieldArray from "./MembersFieldArray";
import SquadDropzone from "./SquadDropzone";

export default function Squads({
  control,
  register,
  getValues,
  setValue,
  reset,
  defaultValues,
  errors,
}: any) {
  // const router = useRouter();

  // const {
  //   formState: { errors },
  // } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "squads", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  // function goBack() {
  //   router.back();
  // }

  return (
    <VStack w="full">
      {fields.map((item, index) => {
        return (
          <VStack w="full" key={item.id}>
            <FormControl isInvalid={errors.squads && errors.squads[index].name}>
              <HStack py="2" w="full" justify="space-between">
                <FormLabel htmlFor={`squads[${index}].name`}>
                  Squad name
                </FormLabel>
                <Button
                  colorScheme="secondary"
                  onClick={() => remove(index)}
                  aria-label="remove"
                  size="sm"
                >
                  Remove Squad
                </Button>
              </HStack>
              <Input
                placeholder="Squad name"
                {...register(`squads[${index}].name`, {
                  required: "This is required",
                  maxLength: {
                    value: 150,
                    message: "Maximum length should be 150",
                  },
                })}
              />

              <FormErrorMessage>
                {errors.squads &&
                  errors.squads[index].name &&
                  errors.squads[index].name.message}
              </FormErrorMessage>
            </FormControl>

            <SquadDropzone
              nestIndex={index}
              formLabel="Squad image"
              {...{ register, setValue, getValues, errors }}
            />
            {/* <FormControl
              isInvalid={errors.squads && errors.squads[index].image}
            >
              <FormLabel htmlFor={`squads[${index}].image`}>
                Squad image
              </FormLabel>

              <Input
                type="file"
                placeholder="Squad logo"
                {...register(`squads[${index}].image`)}
              />

              <FormErrorMessage>
                {errors.squads &&
                  errors.squads[index].image &&
                  errors.squads[index].image.message}
              </FormErrorMessage>
            </FormControl> */}

            <FormControl
              isInvalid={errors.squads && errors.squads[index].members}
            >
              <MembersFieldArray
                nestIndex={index}
                {...{ control, register, setValue }}
              />
              <FormErrorMessage>
                {errors.squads &&
                  errors.squads[index].members &&
                  errors.squads[index].members.message}
              </FormErrorMessage>
            </FormControl>
            <Center w="full" height="50px">
              <Divider />
            </Center>
          </VStack>
        );
      })}

      <HStack w="full" pb="4" justify={["center", "center", "end"]}>
        <Button
          size="sm"
          onClick={() => {
            append({ name: "", members: ["0x0000000000000"], image: null });
          }}
        >
          + New Squad
        </Button>
        <Button
          size="sm"
          colorScheme="secondary"
          type="button"
          onClick={() => reset(defaultValues)}
        >
          Reset
        </Button>
      </HStack>
      <Center w="full" height="10px">
        <Divider />
      </Center>
    </VStack>
  );
}
