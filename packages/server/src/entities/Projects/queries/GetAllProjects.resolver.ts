import { Resolver, Query } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Project } from '../Project.entity';

@Resolver(() => [Project])
export class GetAllProjectsResolver {
  @Query(() => [Project], {
    nullable: true,
    description: 'Gets all the projects in dCompass',
    name: 'getAllProjects',
  })
  async getAllProjects(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
  ): Promise<Project[] | null | undefined> {
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );

    if (allProjects?.projects) {
      const projectIds = allProjects?.projects.map(
        ({ id }: { id: string }) => ({ streamId: id }),
      );

      const projectsWithDetails = await ceramicClient.ceramic.multiQuery(
        projectIds,
      );

      const serializedProjects = await Promise.all(
        Object.values(projectsWithDetails).map(async (stream) => {
          const additionalFields = allProjects.projects.find(
            ({ id }: { id: string }) => id === stream.id.toUrl(),
          );
          return {
            id: stream.id.toUrl(),
            ...stream.state.content,
            ...additionalFields,
          };
        }),
      );
      console.log({ serializedProjects });
      return serializedProjects;
    }
    return undefined;
  }
}
