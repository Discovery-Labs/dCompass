export declare const TagsSchema: {
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
