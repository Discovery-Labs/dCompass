import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { QuestQuestionInput } from "./QuestQuestion.input";

@InputType()
export class EditQuestQuestionInput extends QuestQuestionInput {
  @Field({ nullable: true })
  @IsString({ message: "wrong.type" })
  id?: string;
}
