import { Injectable } from '@nestjs/common';
import { schemaAliases } from '../../core/constants/idx';
import { Ceramic } from '../../core/utils/types';
@Injectable()
export class CeramicProjectService {
  async getAllProjects(ceramicClient: Ceramic) {
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );

    if (!allProjects?.projects) {
      return undefined;
    }

    const projectIds = allProjects?.projects.map(({ id }: { id: string }) => ({
      streamId: id,
    }));

    const projectsWithDetails = await ceramicClient.ceramic.multiQuery(
      projectIds,
    );

    const serializedProjects = await Promise.all(
      Object.values(projectsWithDetails).map(async (stream) => {
        const additionalFields = allProjects.projects.find(
          ({ id }: { id: string }) => id === stream.id.toUrl(),
        );
        const projectTags = await ceramicClient.ceramic.multiQuery(
          stream.content.tags.map((tag: { id: string }) => ({
            streamId: tag.id,
          })),
        );
        return {
          id: stream.id.toUrl(),
          ...stream.state.content,
          ...additionalFields,
          tags: Object.entries(projectTags).map(([streamId, document]) => ({
            id: streamId,
            ...document.content,
          })),
        };
      }),
    );
    return serializedProjects;
  }

  async getProjectById(ceramicClient: Ceramic, projectId: string) {
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects.projects ?? [];
    const ogProject = await ceramicClient.ceramic.loadStream(projectId);
    const additionalFields = projects.find(
      ({ id }: { id: string }) => id === projectId,
    );
    const projectTags = await ceramicClient.ceramic.multiQuery(
      ogProject.content.tags.map((tag: { id: string }) => ({
        streamId: tag.id,
      })),
    );
    if (!ogProject || !additionalFields) {
      return null;
    }
    // const projectPathways = record.state.next?.content.pathways;
    // console.log(projectPathways);
    // if (projectPathways && projectPathways.length > 0) {
    //   const allPathways = await Promise.all(
    //     projectPathways.map(async (pathway: PathwayItem) => {
    //       const fullPathway = await ceramicClient.ceramic.loadStream(pathway.id);
    //       const fullPathwayQuests = fullPathway.state.next?.content.quests;
    //       if (!fullPathwayQuests) {
    //         return {
    //           id: pathway.id,
    //           ...fullPathway.state.content,
    //         };
    //       }
    //       const fullQuests = await Promise.all(
    //         fullPathwayQuests.map(async (quest: QuestItem) => {
    //           const fullQuest = await ceramicClient.ceramic.loadStream(
    //             quest.id,
    //           );
    //           return {
    //             id: quest.id,
    //             ...fullQuest.state.content,
    //           };
    //         }),
    //       );
    //       return {
    //         id: pathway.id,
    //         ...fullPathway.state.content,
    //         quests: fullQuests,
    //       };
    //     }),
    //   );
    //   return {
    //     id: projectId,
    //     ...record.state.content,
    //     pathways: allPathways,
    //   };
    // }
    return {
      id: projectId,
      ...ogProject.state.content,
      ...additionalFields,
      tags: Object.entries(projectTags).map(([streamId, document]) => ({
        id: streamId,
        ...document.content,
      })),
    };
  }
}
