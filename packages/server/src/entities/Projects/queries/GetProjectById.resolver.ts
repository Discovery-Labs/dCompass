import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
// import { BadgeItem } from '../../Badges/mutations/CreateBadge.resolver';
// import { QuestItem } from '../../Quests/mutations/CreateQuest.resolver';
import { Project } from '../Project.entity';

@Resolver(() => Project)
export class GetProjectByIdResolver {
  @Query(() => Project, {
    nullable: true,
    description: 'Gets a project by its Stream ID',
    name: 'getProjectById',
  })
  async getProjectById(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('projectId') projectId: string,
  ): Promise<Project | null | undefined> {
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
    // const projectBadges = record.state.next?.content.badges;
    // console.log(projectBadges);
    // if (projectBadges && projectBadges.length > 0) {
    //   const allBadges = await Promise.all(
    //     projectBadges.map(async (badge: BadgeItem) => {
    //       const fullBadge = await ceramicClient.ceramic.loadStream(badge.id);
    //       const fullBadgeQuests = fullBadge.state.next?.content.quests;
    //       if (!fullBadgeQuests) {
    //         return {
    //           id: badge.id,
    //           ...fullBadge.state.content,
    //         };
    //       }
    //       const fullQuests = await Promise.all(
    //         fullBadgeQuests.map(async (quest: QuestItem) => {
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
    //         id: badge.id,
    //         ...fullBadge.state.content,
    //         quests: fullQuests,
    //       };
    //     }),
    //   );
    //   return {
    //     id: projectId,
    //     ...record.state.content,
    //     badges: allBadges,
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
