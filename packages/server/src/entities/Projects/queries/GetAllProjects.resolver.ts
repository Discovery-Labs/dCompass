import { Resolver, Query } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { CeramicProjectService } from '../CeramicProject.service';
import { Project } from '../Project.entity';

@Resolver(() => [Project])
export class GetAllProjectsResolver {
  constructor(private readonly ceramicProjectService: CeramicProjectService) {}
  @Query(() => [Project], {
    nullable: true,
    description: 'Gets all the projects in dCompass',
    name: 'getAllProjects',
  })
  async getAllProjects(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
  ): Promise<Project[] | null | undefined> {
    return this.ceramicProjectService.getAllProjects(ceramicClient);
  }
}
