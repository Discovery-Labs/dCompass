import { Field, InputType } from "@nestjs/graphql";
import { PathwayDifficultyEnum } from "@prisma/client";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";

@InputType()
export class EditPathwayInput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  id: string;

  @Field()
  title?: string;

  @Field()
  slogan?: string;

  @Field()
  description?: string;

  @Field(() => String)
  difficulty?: PathwayDifficultyEnum;
}
