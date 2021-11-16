// import { TileDocument } from '@ceramicnetwork/stream-tile';
// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
// import { generateHash } from '../../../core/utils/security/hash';
// import { Ceramic } from '../../../core/utils/types';
// import { createCeramicDocument } from '../../../services/ceramic/ceramic.service';
// import { CreateQuestInput } from '../dto/CreateQuest.input';
// import { Quest } from '../Quest.entity';

// export type QuestItem = {
//   id: string;
//   name: string;
//   courseId: string;
//   completedBy: string[];
// };

// export type QuestsList = { quests: Array<QuestItem> };
// @Resolver(() => Quest)
// export class CreateQuestResolver {
//   @Mutation(() => Quest, {
//     nullable: true,
//     description: 'Create a new Quest in Discovery',
//     name: 'createQuest',
//   })
//   async createQuest(
//     @UseCeramicClient() ceramicClient: Ceramic,
//     @Args('input') quest: CreateQuestInput,
//   ): Promise<Quest | null | undefined> {
//     const questionsWithHashedAnswer = await Promise.all(
//       quest.questions.map(async (question) => ({
//         ...question,
//         answer: await generateHash(question.answer),
//       })),
//     );

//     const createdQuest = await createCeramicDocument(ceramicClient, {
//       data: {
//         ...quest,
//         questions: questionsWithHashedAnswer,
//       },
//       family: 'quest',
//       schema: ceramicClient.schemasCommitId['quest'],
//     });
//     if (!createdQuest) {
//       return null;
//     }

//     const existingQuests = await ceramicClient.idx.get<QuestsList>('quests');
//     const quests = existingQuests?.quests ?? [];

//     await ceramicClient.idx.set('quests', {
//       quests: [
//         {
//           id: createdQuest.doc.id.toUrl(),
//           name: quest.name,
//           courseId: quest.courseId,
//         },
//         ...quests,
//       ],
//     });

//     const courseDoc = await TileDocument.load(
//       ceramicClient.ceramic,
//       quest.courseId,
//     );
//     const existingQuestsForCourse = existingQuests?.quests.filter(
//       (q) => q.courseId === quest.courseId,
//     );
//     await courseDoc.update({
//       ...(courseDoc.content as Record<string, any>),
//       quests: [
//         { id: createdQuest.doc.id.toUrl(), name: quest.name },
//         ...(existingQuestsForCourse || []),
//       ],
//     });

//     return {
//       id: createdQuest.doc.id.toUrl(),
//       ...createdQuest.doc.content,
//     };
//   }
// }
