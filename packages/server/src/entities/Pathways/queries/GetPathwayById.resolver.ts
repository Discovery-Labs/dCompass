import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Pathway } from '../Pathway.entity';

@Resolver(() => Pathway)
export class GetPathwayByIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => Pathway, {
    nullable: true,
    description: 'Gets a pathway by its Stream ID',
    name: 'getPathwayById',
  })
  async getPathwayById(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('pathwayId') pathwayId: string,
  ): Promise<Pathway | null | undefined> {
    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found by back-end');
    }
    const { _id, ...pathway } = foundPathway as any;
    return {
      id: _id,
      ...pathway,
    } as Pathway;
  }
}
