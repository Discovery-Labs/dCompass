import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Divider,
  Heading,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { DragEventHandler, useEffect, useState } from "react";
// import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";
import { REQUIRED_FIELD_LABEL } from "../../../../core/constants";
import useCustomColor from "../../../../core/hooks/useCustomColor";
import ControlledSelect from "../../../Inputs/ControlledSelect";

import OptionsFieldArray from "./OptionsFieldArray";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

type initialDnD = {
  draggedFrom: number | null;
  draggedTo: number | null;
  isDragging: boolean;
  originalOrder: Record<"id", string>[];
  updatedOrder: Record<"id", string>[];
};

export default function Questions({ control, register }: any) {
  // const router = useRouter();

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [code, setCode] = useState<Record<number, string>>();
  const { codeEditorScheme } = useCustomColor();
  const { questions } = errors as any;
  const currentValues = watch();
  console.log({ currentValues });

  const initialDnDState: initialDnD = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
  };

  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "questions", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name,
  });
  const [list, setList] = useState(fields);

  // onDragStart fires when an element
  // starts being dragged
  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: list,
    });

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData("text/html", "");
  };

  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver: DragEventHandler<HTMLDivElement> | undefined = (event) => {
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();

    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom || 0;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = () => {
    setList(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  useEffect(() => {
    console.log("Dragged From: ", dragAndDrop && dragAndDrop.draggedFrom);
    console.log("Dropping Into: ", dragAndDrop && dragAndDrop.draggedTo);
  }, [dragAndDrop]);

  useEffect(() => {
    console.log("Fields updated!");
    setList(fields);
  }, [fields]);

  return (
    <VStack w="full">
      {list.map((item, index) => {
        return (
          <VStack
            w="full"
            key={item.id}
            data-position={index}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
          >
            <Heading>Section {index + 1}</Heading>
            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].content
              }
            >
              <FormLabel htmlFor={`questions[${index}].content`}>
                Content
              </FormLabel>
              <CodeEditor
                language="markdown"
                placeholder="Content related to the question (markdown)"
                {...register(`questions[${index}].content`, {
                  required: REQUIRED_FIELD_LABEL,
                })}
                onChange={(e) => {
                  setCode((code) => ({ ...code, [index]: e.target.value }));
                  setValue(`questions[${index}].content`, e.target.value);
                }}
                style={{
                  fontSize: "16px",
                }}
                className={codeEditorScheme}
                padding={15}
              />
              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].question &&
                  questions[index].question.content}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].question
              }
            >
              <FormLabel htmlFor={`questions[${index}].question`}>
                Question
              </FormLabel>
              <Input
                placeholder="Question here..."
                {...register(`questions[${index}].question`, {
                  required: "This is required",
                  maxLength: {
                    value: 200,
                    message: "Maximum length should be 200",
                  },
                })}
              />

              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].question &&
                  questions[index].question.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].options
              }
            >
              <FormLabel htmlFor={`questions[${index}].options`}>
                Answers
              </FormLabel>
              <OptionsFieldArray nestIndex={index} {...{ control, register }} />
              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].options &&
                  questions[index].options.message}
              </FormErrorMessage>
            </FormControl>

            <ControlledSelect
              control={control}
              name={`questions[${index}].answer`}
              label="Correct answer(s)"
              isMulti
              rules={{
                required: "At least one correct answer must be set.",
                minLength: {
                  value: 1,
                  message: "At least one correct answer must be set.",
                },
              }}
              options={
                currentValues.questions[index]?.options?.length > 0
                  ? currentValues.questions[index].options.map(
                      (opt: { value: string }) => ({
                        label: opt.value,
                        value: opt.value,
                        colorScheme: "primary",
                      })
                    )
                  : []
              }
            />
            <Button
              colorScheme="secondary"
              onClick={() => {
                setCode((code) => {
                  if (code) {
                    const newCodes = code;
                    delete newCodes[index];
                    return newCodes;
                  }
                });
                remove(index);
                setList((list) =>
                  list.filter((itm, itemIndex) => itemIndex !== index)
                );
              }}
              aria-label="remove"
              size="md"
              px="10"
            >
              Remove section {index + 1}
            </Button>
            <Divider bg="none" py="5" />
          </VStack>
        );
      })}

      <HStack w="full">
        <Button
          w="full"
          type="button"
          onClick={() => {
            append({
              content: "",
              question: "",
              options: [""],
              answer: "",
            });
          }}
        >
          + New Section
        </Button>
      </HStack>
    </VStack>
  );
}
