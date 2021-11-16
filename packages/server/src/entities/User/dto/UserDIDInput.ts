import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsDefined } from 'class-validator';

@InputType()
export class UserDIDInput {
  @Field(() => String)
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  userDID: string;
}
