import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-errors';
import { ethers } from 'ethers';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { CreateProjectInput } from '../dto/CreateProject.input';
import { CreateProjectOutput } from '../dto/CreateProject.output';
// import { Project } from '../Project.entity';

@Resolver(() => [String])
export class CreateProjectResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Mutation(() => [CreateProjectOutput], {
    nullable: true,
    description: 'Create a new Project in dCompass',
    name: 'createProject',
  })
  async createProject(
    @UseCeramic()
    { ceramicClient }: UseCeramicClient,
    @UseThreadDB()
    { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') { id, tokenUris, creatorSignature }: CreateProjectInput,
  ): Promise<CreateProjectOutput[] | null> {
    // Check that the current user is the owner of the project
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, tokenUris }),
      creatorSignature,
    );
    const ogProject = await ceramicClient.ceramic.loadStream(id);
    console.log('CTRLR', ogProject.controllers[0]);
    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogProject.controllers[0],
    );

    console.log({ ownerAccounts });
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    await this.threadDBService.create({
      collectionName: 'Project',
      threadId: latestThreadId,
      values: [
        {
          streamId: id,
          ...ogProject.content,
          tokenUris,
          isFeatured: false,
          createdBy: decodedAddress,
          createdAt: new Date().toISOString(),
        },
      ],
      dbClient,
    });

    return null;
  }
}
