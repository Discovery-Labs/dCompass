export declare const schemas: {
    dProfiles: {
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
