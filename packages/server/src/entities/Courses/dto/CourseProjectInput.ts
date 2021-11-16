import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CourseProjectInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  id: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  name: string;
}
