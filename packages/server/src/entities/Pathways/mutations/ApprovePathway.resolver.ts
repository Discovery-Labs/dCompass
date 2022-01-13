import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';
import { NotFoundException } from '@nestjs/common';
import ABIS from '@discovery-dao/hardhat/abis.json';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Pathway } from '../Pathway.entity';
import { schemaAliases } from '../../../core/constants/idx';
import { ApprovePathwayInput } from '../dto/ApprovePathway.input';
import { Squad } from '../../Squads/Squad.entity';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';

@Resolver(() => Pathway)
export class ApprovePathwayResolver {
  constructor(public readonly appService: AppService) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Approve a new Pathway in dCompass',
    name: 'approvePathway',
  })
  async approvePathway(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input')
    { id, pathwayApproverSignature, chainId }: ApprovePathwayInput,
  ): Promise<Pathway | null | undefined> {
    // Check that the current user is the owner of the pathway
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    const projectId = ogPathway.content.projectId;
    console.log('approving pathway');
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      pathwayApproverSignature,
    );
    console.log({ decodedAddress });
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];
    const ogProject = await ceramicClient.ceramic.loadStream(projectId);

    const additionalFields = projects.find(
      (project: { id: string }) => project.id === projectId,
    );

    if (!ogProject || !additionalFields) {
      throw new NotFoundException('Project not found');
    }

    const projectIndexedFields = {
      ...ogProject.content,
      ...additionalFields,
    };

    const projectContributors = projectIndexedFields.squads
      ? projectIndexedFields.squads.flatMap((squad: Squad) =>
          squad.members.map((m) => m.toLowerCase()),
        )
      : [];

    if (
      !projectIndexedFields ||
      !projectContributors.includes(decodedAddress.toLowerCase())
    ) {
      throw new ForbiddenError('Unauthorized');
    }

    // remove previously indexed project and recreate it as with the new pending pathway
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    const appProjectsUpdated = [
      {
        id: projectId,
        ...projectIndexedFields,
        // add pathway in approved pathways
        pathways: [
          ...(projectIndexedFields.pathways ?? []),
          ogPathway.id.toUrl(),
        ],
        // remove pathway from pending pathways
        pendingPathways: [
          ...(projectIndexedFields.pendingPathways
            ? projectIndexedFields.pendingPathways.filter(
                (pathway: string) => pathway !== ogPathway.id.toUrl(),
              )
            : []),
        ],
      },
      ...existingProjects,
    ];

    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: appProjectsUpdated,
    });

    const previousPathways = await ceramicClient.dataStore.get(
      schemaAliases.PATHWAYS_ALIAS,
    );
    const allPathways = previousPathways?.pathways ?? [];
    await ceramicClient.dataStore.set(schemaAliases.PATHWAYS_ALIAS, {
      pathways: [
        ...allPathways,
        {
          id: ogPathway.id.toUrl(),
          ...ogPathway.content,
        },
      ],
    });

    const chaindIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chaindIdStr)) {
      throw new Error('Unsupported Network');
    }

    const verifyContract = this.appService.getContract(chaindIdStr, 'Verify');
    const pathwayContract = this.appService.getContract(
      chaindIdStr,
      'PathwayNFT',
    );

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(
        projectId.split('://')[1],
        ogPathway.id.toString(),
      ),
      verifyContract.thresholdNoncesById(ogPathway.id.toString()),
    ]);

    console.log({ pathwayId: ogPathway.id.toString() });
    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: metadataNonceId,
        objectId: ogPathway.id.toString(),
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: thresholdNonceId,
        objectId: ogPathway.id.toString(),
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return {
      id,
      ...ogPathway.content,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
        ,
      ],
    };
  }
}
