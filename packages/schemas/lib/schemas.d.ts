export declare const schemas: {
    dCompass: {
        Contributors: {
            $schema: string;
            title: string;
            type: string;
            items: {
                type: string;
                title: string;
                properties: {
                    id: {
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
                            pendingBadges: {
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
                            id: {
                                $ref: string;
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
                            badges: {
                                type: string;
                                title: string;
                                items: {
                                    $ref: string;
                                };
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
                                        id: {
                                            $ref: string;
                                        };
                                        name: {
                                            type: string;
                                            title: string;
                                            maxLength: number;
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
                                $ref: string;
                            };
                            childProjects: {
                                type: string;
                                items: {
                                    $ref: string;
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
                id: {
                    $ref: string;
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
                badges: {
                    type: string;
                    title: string;
                    items: {
                        $ref: string;
                    };
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
                            id: {
                                $ref: string;
                            };
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
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
                    $ref: string;
                };
                childProjects: {
                    type: string;
                    items: {
                        $ref: string;
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
        Badges: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                badges: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            id: {
                                $ref: string;
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
        Badge: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
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
                    $ref: string;
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
                        title: string;
                        properties: {
                            id: {
                                $ref: string;
                            };
                        };
                    };
                };
                pendingQuests: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            id: {
                                $ref: string;
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
                            id: {
                                $ref: string;
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
                name: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                description: {
                    type: string;
                };
                badgeId: {
                    $ref: string;
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
                nfts: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            claimedBy: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                };
                            };
                            rarity: {
                                type: string;
                                enum: string[];
                            };
                            name: {
                                type: string;
                                maxLength: number;
                            };
                            url: {
                                $ref: string;
                            };
                        };
                    };
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
        Tags: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                tags: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            id: {
                                $ref: string;
                            };
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
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
        Tag: {
            $schema: string;
            title: string;
            description: string;
            type: string;
            properties: {
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
                description: {
                    type: string;
                };
                color: {
                    type: string;
                };
            };
        };
    };
};
