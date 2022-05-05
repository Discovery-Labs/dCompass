import { Field, ObjectType } from "@nestjs/graphql";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";

@ObjectType()
export class ApproveProjectOutput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  id: string;

  @Field(() => [String])
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  tokenUris: string[];

  @Field(() => Boolean, { defaultValue: false })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  isFeatured: boolean;
}
