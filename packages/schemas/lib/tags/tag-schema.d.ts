export declare const TagSchema: {
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
