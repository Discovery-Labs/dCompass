export declare const schemas: {
    dCompass: {
        UserPrivateIdentity: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                privateIdentity: {
                    type: string;
                };
                token: {
                    type: string;
                };
            };
        };
        AppProjects: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                projects: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            _id: {
                                type: string;
                            };
                            streamId: {
                                type: string;
                            };
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
                            };
                            color: {
                                type: string;
                            };
                            whitepaper: {
                                type: string;
                            };
                            website: {
                                type: string;
                            };
                            twitter: {
                                type: string;
                            };
                            discord: {
                                type: string;
                            };
                            github: {
                                type: string;
                            };
                            description: {
                                type: string;
                            };
                            logo: {
                                type: string;
                            };
                            contracts: {
                                type: string;
                                items: {
                                    type: string;
                                    title: string;
                                };
                            };
                            repos: {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            };
                            pathways: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                };
                            };
                            members: {
                                type: string;
                                title: string;
                                items: {
                                    $ref: string;
                                };
                            };
                            pendingPathways: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                };
                            };
                            pendingMembers: {
                                type: string;
                                title: string;
                                items: {
                                    $ref: string;
                                };
                            };
                            tokenUris: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            isFeatured: {
                                type: string;
                            };
                            createdBy: {
                                type: string;
                                maxLength: number;
                            };
                            updatedBy: {
                                type: string;
                                maxLength: number;
                            };
                            createdAt: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            updatedAt: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            tags: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                    title: string;
                                    properties: {
                                        _id: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            squads: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        name: {
                                            type: string;
                                        };
                                        image: {
                                            type: string;
                                        };
                                        members: {
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                            parentProjectId: {
                                type: string;
                            };
                            childProjects: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            definitions: {
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Projects: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                projects: {
                    type: string;
                    title: string;
                    items: {
                        $ref: string;
                    };
                };
            };
            definitions: {
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Project: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                color: {
                    type: string;
                };
                whitepaper: {
                    type: string;
                };
                website: {
                    type: string;
                };
                twitter: {
                    type: string;
                };
                discord: {
                    type: string;
                };
                github: {
                    type: string;
                };
                description: {
                    type: string;
                };
                logo: {
                    type: string;
                };
                contracts: {
                    type: string;
                    items: {
                        type: string;
                        title: string;
                    };
                };
                repos: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                };
                pathways: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                members: {
                    type: string;
                    title: string;
                    items: {
                        $ref: string;
                    };
                };
                pendingPathways: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                pendingMembers: {
                    type: string;
                    title: string;
                    items: {
                        $ref: string;
                    };
                };
                tokenUris: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                isFeatured: {
                    type: string;
                };
                createdBy: {
                    type: string;
                    maxLength: number;
                };
                updatedBy: {
                    type: string;
                    maxLength: number;
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                tags: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            _id: {
                                type: string;
                            };
                        };
                    };
                };
                squads: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            image: {
                                type: string;
                            };
                            members: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
                parentProjectId: {
                    type: string;
                };
                childProjects: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            definitions: {
                IPFSUrl: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
                positiveInteger: {
                    type: string;
                    minimum: number;
                };
                imageMetadata: {
                    type: string;
                    properties: {
                        src: {
                            $ref: string;
                        };
                        mimeType: {
                            type: string;
                            maxLength: number;
                        };
                        width: {
                            $ref: string;
                        };
                        height: {
                            $ref: string;
                        };
                        size: {
                            $ref: string;
                        };
                    };
                    required: string[];
                };
                imageSources: {
                    type: string;
                    properties: {
                        original: {
                            $ref: string;
                        };
                        alternatives: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                    };
                    required: string[];
                };
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Pathways: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                pathways: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
        Pathway: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                title: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                projectId: {
                    type: string;
                };
                image: {
                    type: string;
                };
                description: {
                    type: string;
                };
                createdBy: {
                    type: string;
                };
                difficulty: {
                    type: string;
                    enum: string[];
                };
                isFeatured: {
                    type: string;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
                prerequisites: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                quests: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                pendingQuests: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
            };
            definitions: {
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Quests: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                quests: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            _id: {
                                type: string;
                            };
                            streamId: {
                                type: string;
                            };
                            pathwayId: {
                                type: string;
                            };
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
                            };
                            description: {
                                type: string;
                            };
                            completedBy: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                };
                            };
                            createdAt: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            updatedAt: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            questType: {
                                type: string;
                                maxLength: number;
                            };
                            rewardAmount: {
                                type: string;
                            };
                            rewardUserCap: {
                                type: string;
                            };
                            rewardCurrency: {
                                type: string;
                            };
                            id: {
                                type: string;
                            };
                        };
                    };
                };
            };
            definitions: {
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Quest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
            definitions: {
                IPFSUrl: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        SnaphotVoterQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                proposalId: {
                    type: string;
                    maxLength: number;
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        NFTOwnerQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                collectionContractAddress: {
                    type: string;
                    maxLength: number;
                };
                namespace: {
                    type: string;
                    maxLength: number;
                };
                chainId: {
                    type: string;
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        PoapOwnerQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                poapTokenId: {
                    type: string;
                    maxLength: number;
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        DiscordMemberQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                discordGuildId: {
                    type: string;
                    items: {
                        type: string;
                        maxLength: number;
                    };
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        QuizQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                questions: {
                    type: string;
                    title: string;
                    minItems: number;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            question: {
                                type: string;
                                maxLength: number;
                            };
                            answer: {
                                type: string;
                            };
                            choices: {
                                type: string;
                                title: string;
                                minItems: number;
                                maxItems: number;
                                items: {
                                    type: string;
                                    maxLength: number;
                                };
                            };
                        };
                    };
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        TokenHolderQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                amount: {
                    type: string;
                };
                tokenContractAddress: {
                    type: string;
                    maxLength: number;
                };
                namespace: {
                    type: string;
                    maxLength: number;
                };
                chainId: {
                    type: string;
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        TwitterFollowerVoterQuest: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                twitterHandles: {
                    type: string;
                    items: {
                        type: string;
                        maxLength: number;
                    };
                };
                _id: {
                    type: string;
                };
                streamId: {
                    type: string;
                };
                pathwayId: {
                    type: string;
                };
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                completedBy: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                    };
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                questType: {
                    type: string;
                    maxLength: number;
                };
                rewardAmount: {
                    type: string;
                };
                rewardUserCap: {
                    type: string;
                };
                rewardCurrency: {
                    type: string;
                };
            };
        };
        Tags: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                tags: {
                    type: string;
                    title: string;
                    items: {
                        $ref: string;
                    };
                };
            };
            definitions: {
                CeramicStreamId: {
                    type: string;
                    pattern: string;
                    maxLength: number;
                };
            };
        };
        Tag: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                createdAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    maxLength: number;
                };
                label: {
                    type: string;
                };
                value: {
                    type: string;
                };
                color: {
                    type: string;
                };
            };
        };
    };
};
