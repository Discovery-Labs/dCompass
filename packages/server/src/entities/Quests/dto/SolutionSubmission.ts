import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SolutionSubmission {
  @Field()
  id: string;
  @Field()
  solution: string;
  @Field()
  did: string;
  @Field({ nullable: true })
  reviewComment?: string;
  @Field({ defaultValue: "under-review" })
  status: string;
}
