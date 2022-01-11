import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';

import { Pathway } from '../Pathway.entity';

@Resolver(() => Pathway)
export class GetPathwayByIdResolver {
  @Query(() => Pathway, {
    nullable: true,
    description: 'Gets a pathway by its Stream ID',
    name: 'getPathwayById',
  })
  async getPathwayById(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('pathwayId') pathwayId: string,
  ): Promise<Pathway | null | undefined> {
    console.log('PATHWAY QUERY');
    const record = await ceramicClient.ceramic.loadStream(pathwayId);
    if (!record) {
      return null;
    }
    console.log({ record });
    return {
      id: pathwayId,
      ...record.state.content,
      // quests: record.state.next?.content.quests,
    };
  }
}
