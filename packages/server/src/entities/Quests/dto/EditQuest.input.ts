import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";
import { QuestDifficultyEnum } from "../Quest.entity";
import { EditQuestQuestionInput } from "./EditQuestQuestion.input";

@InputType()
export class EditQuestInput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  id: string;

  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  questType: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  slogan?: string;

  @Field(() => QuestDifficultyEnum, {
    nullable: true,
  })
  difficulty?: QuestDifficultyEnum;

  @Field(() => [EditQuestQuestionInput], { nullable: true })
  questions?: EditQuestQuestionInput[];
}
