import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Project } from '../../Projects/Project.entity';
import { Pathway } from '../Pathway.entity';

@Resolver(() => [Pathway])
export class GetAllPathwaysByProjectIdResolver {
  @Query(() => [Pathway], {
    nullable: true,
    description: 'Gets all the pathways in dCompass',
    name: 'getAllPathwaysByProjectId',
  })
  async getAllPathwaysByProjectId(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('projectId') projectId: string,
  ): Promise<Pathway[] | null> {
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];
    console.log(projects);
    const foundProject = projects.find(
      (project: Project) => project.id === projectId,
    );

    console.log({ foundProject });
    if (!foundProject) {
      throw new NotFoundException('Project not found');
    }
    const pathwayIds = foundProject.pathways
      ? foundProject.pathways.map((id: string) => ({
          streamId: id,
        }))
      : [];

    const pendingPathwayIds = foundProject.pendingPathways
      ? foundProject.pendingPathways.map((id: string) => ({
          streamId: id,
        }))
      : [];

    console.log({ pathwayIds });

    const [pathwaysWithDetails, pendingPathwaysWithDetails] = await Promise.all(
      [
        ceramicClient.ceramic.multiQuery(pathwayIds),
        ceramicClient.ceramic.multiQuery(pendingPathwayIds),
      ],
    );

    console.log({ pathwaysWithDetails, pendingPathwaysWithDetails });

    const serializedPathways = Object.values(pathwaysWithDetails).map(
      (stream) => {
        return {
          id: stream.id.toUrl(),
          ...stream.state.content,
          isPending: false,
        };
      },
    );

    const serializedPendingPathways = Object.values(
      pendingPathwaysWithDetails,
    ).map((stream) => {
      return {
        id: stream.id.toUrl(),
        ...stream.state.content,
        isPending: true,
      };
    });
    console.log({ serializedPathways, serializedPendingPathways });
    return [...serializedPathways, ...serializedPendingPathways];
  }
}
