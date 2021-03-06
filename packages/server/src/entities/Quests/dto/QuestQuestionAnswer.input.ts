import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";

@InputType()
export class QuestQuestionAnswerInput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  question: string;

  @Field(() => [String])
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  answer: string[];
}
