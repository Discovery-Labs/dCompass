import { Injectable } from '@nestjs/common';
import { getIdentity } from '../../core/resources/ThreadDB/thread-db';
import { Client, ThreadID, QueryJSON } from '@textile/hub';

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
}
