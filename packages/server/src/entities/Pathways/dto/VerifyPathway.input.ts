import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyPathwayInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  id: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  pathwayMinterSignature: string;

  @Field()
  namespace?: string;

  @Field(() => Int)
  chainId: number;
}
