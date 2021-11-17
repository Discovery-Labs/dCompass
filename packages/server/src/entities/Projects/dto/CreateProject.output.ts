import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

@ObjectType()
export class CreateProjectOutput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  id: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  tokenUri: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  isFeatured: boolean;

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
