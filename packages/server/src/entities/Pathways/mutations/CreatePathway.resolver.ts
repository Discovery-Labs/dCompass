import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { CreatePathwayInput } from '../dto/CreatePathway.input';
import { Pathway } from '../Pathway.entity';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';

@Resolver(() => Pathway)
export class CreatePathwayResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Create a new Pathway in dCompass',
    name: 'createPathway',
  })
  async createPathway(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @UseThreadDB()
    { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') { id, pathwayCreatorSignature }: CreatePathwayInput,
  ): Promise<Pathway | null | undefined> {
    // Check that the current user is the owner of the pathway
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    const projectId = ogPathway.content.projectId;
    console.log(ogPathway.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, projectId }),
      pathwayCreatorSignature,
    );

    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogPathway.controllers[0],
    );
    console.log({ ownerAccounts, decodedAddress });
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    const [newPathwayId] = await this.threadDBService.create({
      collectionName: 'Pathway',
      threadId: latestThreadId,
      values: [
        {
          streamId: id,
          ...ogPathway.content,
        },
      ],
      dbClient,
    });

    const projectDetails = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });

    const existingPendingPathways = projectDetails.pendingPathways ?? [];
    await this.threadDBService.update({
      collectionName: 'Project',
      dbClient,
      threadId: latestThreadId,
      values: [
        {
          _id: projectId,
          ...projectDetails,
          pendingPathways: [...existingPendingPathways, newPathwayId],
        },
      ],
    });

    return {
      id: newPathwayId,
      streamId: id,
      ...ogPathway.content,
    };
  }
}
