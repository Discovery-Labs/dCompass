import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { CeramicProjectService } from '../CeramicProject.service';

import { Project } from '../Project.entity';

@Resolver(() => Project)
export class GetProjectByIdResolver {
  constructor(private readonly ceramicProjectService: CeramicProjectService) {}

  @Query(() => Project, {
    nullable: true,
    description: 'Gets a project by its Stream ID',
    name: 'getProjectById',
  })
  async getProjectById(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('projectId') projectId: string,
  ): Promise<Project | null | undefined> {
    return this.ceramicProjectService.getProjectById(ceramicClient, projectId);
  }
}
