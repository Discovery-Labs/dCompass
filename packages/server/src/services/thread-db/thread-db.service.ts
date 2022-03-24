import { Injectable, NotFoundException } from '@nestjs/common';
import { getIdentity } from '../../core/resources/ThreadDB/thread-db';
import { Client, ThreadID, QueryJSON, Where } from '@textile/hub';
import { Tag } from '../../entities/Tags/Tag.entity';

@Injectable()
export class ThreadDBService {
  getAppIdentity(key: string) {
    return getIdentity(key);
  }

  async getAppThreads(dbClient: Client) {
    const appThreads = await dbClient.listThreads();
    const latestThreadId = ThreadID.fromString(
      appThreads[appThreads.length - 1].id,
    );
    return { appThreads, latestThreadId };
  }

  async getCollections(dbClient: Client, threadId: ThreadID) {
    const collections = await dbClient.listCollections(threadId);
    return collections;
  }

  async create({
    collectionName,
    dbClient,
    threadId,
    values,
  }: {
    dbClient: Client;
    threadId: ThreadID;
    collectionName: string;
    values: any[];
  }) {
    return dbClient.create(threadId, collectionName, values);
  }

  async update({
    collectionName,
    dbClient,
    threadId,
    values,
  }: {
    dbClient: Client;
    threadId: ThreadID;
    collectionName: string;
    values: any[];
  }) {
    return dbClient.save(threadId, collectionName, values);
  }

  async query({
    collectionName,
    dbClient,
    threadId,
    query,
  }: {
    dbClient: Client;
    threadId: ThreadID;
    collectionName: string;
    query?: QueryJSON;
  }) {
    if (query) {
      return dbClient.find(threadId, collectionName, query);
    }
    return dbClient.find(threadId, collectionName, {
      limit: 1000,
    });
  }

  async getProjectById({
    dbClient,
    threadId,
    projectId,
  }: {
    dbClient: Client;
    threadId: ThreadID;
    projectId: string;
  }) {
    const [foundProjects, allTags] = await Promise.all([
      this.query({
        collectionName: 'Project',
        dbClient,
        threadId,
        query: new Where('_id').eq(projectId),
      }),
      this.query({
        collectionName: 'Tag',
        threadId,
        dbClient,
      }),
    ]);

    if (!foundProjects || foundProjects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const [project] = foundProjects as any[];
    console.log({ project });
    const { _id, _mod, ...rest } = project;

    const foundProject = {
      id: _id,
      ...rest,
      tags: allTags
        .map((t: any) => ({ id: t._id, ...t }))
        .filter((tag: any) =>
          project.tags.map((pjTag: Tag) => pjTag.id).includes(tag.id),
        ),
    };
    return foundProject;
  }

  async getPathwayById({
    dbClient,
    threadId,
    pathwayId,
  }: {
    dbClient: Client;
    threadId: ThreadID;
    pathwayId: string;
  }) {
    const [foundPathway] = await this.query({
      collectionName: 'Pathway',
      dbClient,
      threadId,
      query: new Where('_id').eq(pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found by back-end');
    }
    return foundPathway as any;
  }
}
