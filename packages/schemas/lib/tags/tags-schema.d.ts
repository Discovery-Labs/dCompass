export declare const TagsSchema: {
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
