import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
// import { ProjectTagInput } from './ProjectTagsInput';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  id: string;

  // @Field()
  // @IsString({ message: 'wrong.type' })
  // @IsDefined({ message: 'not.defined' })
  // @IsNotEmpty({ message: 'not.empty' })
  // description: string;

  // @Field(() => [ProjectTagInput])
  // @IsDefined({ message: 'not.defined' })
  // @IsNotEmpty({ message: 'not.empty' })
  // tags: ProjectTagInput[];

  // @Field()
  // @IsString({ message: 'wrong.type' })
  // @IsDefined({ message: 'not.defined' })
  // @IsNotEmpty({ message: 'not.empty' })
  // github: string;

  // @Field()
  // @IsString({ message: 'wrong.type' })
  // @IsDefined({ message: 'not.defined' })
  // @IsNotEmpty({ message: 'not.empty' })
  // color: string;
}
