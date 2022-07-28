import { Resolver, Query } from "@nestjs/graphql";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";

@Resolver(() => String)
export class GetAppDIDResolver {
  @Query(() => String, {
    nullable: true,
    description: "Return the DID of the dCompass backend server",
    name: "getAppDID",
  })
  async getAppDID(
    @UseCeramic() { ceramicClient }: UseCeramicClient
  ): Promise<string | null | undefined> {
    return ceramicClient.ceramic.did?.id;
  }
}
