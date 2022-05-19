import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";

@InputType()
export class GetBountyQuestByIdInput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  questId: string;
}
