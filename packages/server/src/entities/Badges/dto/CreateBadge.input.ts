import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBadgeInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  id: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  badgeCreatorSignature: string;
}
