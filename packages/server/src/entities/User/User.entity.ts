import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  did: string;

  @Field(() => [String])
  ethAddresses: string[];

  @Field(() => Boolean, { defaultValue: false })
  confirmed?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  restricted?: boolean;
}
