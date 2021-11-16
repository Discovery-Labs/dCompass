import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
import { Ceramic } from '../../../core/utils/types';
import { CreateProjectInput } from '../dto/CreateProject.input';
// import { Project } from '../Project.entity';

@Resolver(() => [String])
export class CreateProjectResolver {
  @Mutation(() => [String], {
    nullable: true,
    description: 'Create a new Project in dCompass',
    name: 'createProject',
  })
  async createProject(
    @UseCeramicClient() ceramicClient: Ceramic,
    @Args('input') project: CreateProjectInput,
  ): Promise<string[]> {
    const existingProjects = await ceramicClient.dataStore.get(
      schemaAliases.PROJECTS_ALIAS,
    );

    const projects = existingProjects?.projects ?? [];
    await ceramicClient.dataStore.set(schemaAliases.PROJECTS_ALIAS, {
      projects: [project.id, ...projects],
    });

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.PROJECTS_ALIAS,
    );

    return allProjects.projects;
  }
}
