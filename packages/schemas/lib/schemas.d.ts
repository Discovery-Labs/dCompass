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
        Projects: {
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
                            id: {
                                $ref: string;
                            };
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
                            };
                            courses: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                    title: string;
                                    properties: {
                                        id: {
                                            $ref: string;
                                        };
                                        title: {
                                            type: string;
                                            title: string;
                                            maxLength: number;
                                        };
                                    };
                                };
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
        Project: {
            $schema: string;
            title: string;
            type: string;
            properties: {
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
                contract_address: {
                    type: string;
                };
                is_featured: {
                    type: string;
                };
                repos: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                };
                peerProjects: {
                    type: string;
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
        courses: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                courses: {
                    type: string;
                    title: string;
                    items: {
                        type: string;
                        title: string;
                        properties: {
                            id: {
                                $ref: string;
                            };
                            title: {
                                type: string;
                                title: string;
                                maxLength: number;
                            };
                            courseType: {
                                type: string;
                                enum: string[];
                            };
                            difficulty: {
                                type: string;
                                enum: string[];
                            };
                            projects: {
                                type: string;
                                title: string;
                                items: {
                                    type: string;
                                    title: string;
                                    properties: {
                                        id: {
                                            $ref: string;
                                        };
                                        title: {
                                            type: string;
                                            title: string;
                                            maxLength: number;
                                        };
                                    };
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
                                        name: {
                                            type: string;
                                            title: string;
                                            maxLength: number;
                                        };
                                    };
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
        course: {
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
                gitbook: {
                    type: string;
                };
                files: {
                    type: string;
                    minItems: number;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                                maxLength: number;
                            };
                            cid: {
                                type: string;
                            };
                        };
                    };
                };
                reviewers: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                contributors: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                authors: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
        };
        quests: {
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
                            name: {
                                type: string;
                                title: string;
                                maxLength: number;
                            };
                            courseId: {
                                $ref: string;
                            };
                            completedBy: {
                                type: string;
                                title: string;
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
        quest: {
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
                questions: {
                    type: string;
                    title: string;
                    minItems: number;
                    items: {
                        type: string;
                        title: string;
                        properties: {
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
                            question: {
                                type: string;
                                maxLength: number;
                            };
                            answer: {
                                type: string;
                                maxLength: number;
                            };
                        };
                    };
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
