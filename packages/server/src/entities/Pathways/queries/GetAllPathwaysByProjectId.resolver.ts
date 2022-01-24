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
    // Comparison between ceramic urls
    // (eg: ceramic://some_stream_id === ceramic://another_stream_id)
    const foundProject = projects.find(
      (project: Project) => project.id === projectId,
    );

    if (!foundProject) {
      throw new NotFoundException('Project not found??');
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

    const indexedPathways = await ceramicClient.dataStore.get(
      schemaAliases.PATHWAYS_ALIAS,
    );

    const pathwaysWithAdditionalDetails = indexedPathways?.pathways ?? [];

    const [pathwaysWithDetails, pendingPathwaysWithDetails] = await Promise.all(
      [
        ceramicClient.ceramic.multiQuery(pathwayIds),
        ceramicClient.ceramic.multiQuery(pendingPathwayIds),
      ],
    );

    const serializedPathways = Object.values(pathwaysWithDetails).map(
      (stream) => {
        const serverSidePathwayInfos = pathwaysWithAdditionalDetails.find(
          (pathway: Pathway) => pathway.id === stream.id.toUrl(),
        );
        if (serverSidePathwayInfos) {
          const quests =
            serverSidePathwayInfos.quests &&
            serverSidePathwayInfos.quests.length > 0
              ? serverSidePathwayInfos.quests.map((questId: string) => ({
                  id: questId,
                }))
              : [];

          const pendingQuests =
            serverSidePathwayInfos.pendingQuests &&
            serverSidePathwayInfos.pendingQuests.length > 0
              ? serverSidePathwayInfos.pendingQuests.map((questId: string) => ({
                  id: questId,
                }))
              : [];
          return {
            id: stream.id.toUrl(),
            ...stream.state.content,
            ...serverSidePathwayInfos,
            quests,
            pendingQuests,
            isPending: false,
          };
        }
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
      const serverSidePathwayInfos = pathwaysWithAdditionalDetails.find(
        (pathway: Pathway) => pathway.id === stream.id.toUrl(),
      );
      if (serverSidePathwayInfos) {
        const quests =
          serverSidePathwayInfos.quests &&
          serverSidePathwayInfos.quests.length > 0
            ? serverSidePathwayInfos.quests.map((questId: string) => ({
                id: questId,
              }))
            : [];

        const pendingQuests =
          serverSidePathwayInfos.pendingQuests &&
          serverSidePathwayInfos.pendingQuests.length > 0
            ? serverSidePathwayInfos.pendingQuests.map((questId: string) => ({
                id: questId,
              }))
            : [];
        return {
          id: stream.id.toUrl(),
          ...stream.state.content,
          ...serverSidePathwayInfos,
          quests,
          pendingQuests,
          isPending: true,
        };
      }
      return {
        id: stream.id.toUrl(),
        ...stream.state.content,
        ...serverSidePathwayInfos,
        isPending: true,
      };
    });

    return [...serializedPathways, ...serializedPendingPathways];
  }
}
