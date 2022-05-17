import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsDefined, IsNotEmpty } from "class-validator";
import { ProjectSquadsInput } from "./ProjectSquads.input";

@InputType()
export class EditProjectInput {
  @Field()
  @IsString({ message: "wrong.type" })
  @IsDefined({ message: "not.defined" })
  @IsNotEmpty({ message: "not.empty" })
  id: string;

  @Field(() => [String], { nullable: true })
  tokenUris?: string[];

  @Field()
  logo?: string;

  @Field()
  name?: string;

  @Field()
  slogan?: string;

  @Field()
  description?: string;

  @Field(() => [ProjectSquadsInput])
  squads?: ProjectSquadsInput[];

  @Field()
  color?: string;

  @Field()
  whitepaper?: string;

  @Field()
  website?: string;

  @Field()
  twitter?: string;

  @Field()
  discord?: string;

  @Field()
  github?: string;

  @Field()
  gitbook?: string;

  @Field(() => [String])
  tags?: string[];
}
