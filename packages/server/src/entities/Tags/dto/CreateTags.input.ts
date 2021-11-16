import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { CreateTagInput } from './CreateTag.input';

@InputType()
export class CreateTagsInput {
  @Field(() => [CreateTagInput])
  @IsArray({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  tags: CreateTagInput[];
}
