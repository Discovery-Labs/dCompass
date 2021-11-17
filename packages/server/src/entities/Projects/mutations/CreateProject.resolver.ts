import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
import { Ceramic } from '../../../core/utils/types';
import { CreateProjectInput } from '../dto/CreateProject.input';
import { CreateProjectOutput } from '../dto/CreateProject.output';
// import { Project } from '../Project.entity';

@Resolver(() => [String])
export class CreateProjectResolver {
  @Mutation(() => [CreateProjectOutput], {
    nullable: true,
    description: 'Create a new Project in dCompass',
    name: 'createProject',
  })
  async createProject(
    @UseCeramicClient() ceramicClient: Ceramic,
    @Args('input') { id, tokenUri }: CreateProjectInput,
  ): Promise<CreateProjectOutput[]> {
    const existingProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );

    const projects = existingProjects?.projects ?? [];
    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: [{ id, tokenUri, isFeatured: false }, ...projects],
    });

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );

    return allProjects.projects;
  }
}
