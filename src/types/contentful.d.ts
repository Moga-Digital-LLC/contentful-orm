import { ContentFields, KeyValueMap } from 'contentful-management';
export type NodeType = 'document' | 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 'ordered-list' | 'unordered-list' | 'list-item' | 'hr' | 'blockquote' | 'embedded-entry-block' | 'embedded-asset-block' | 'hyperlink' | 'entry-hyperlink' | 'asset-hyperlink' | 'resource-hyperlink';
export type Mark = 'bold' | 'italic' | 'underline' | 'code';
export interface ContentfulValidation {
    unique?: boolean;
    regexp?: {
        pattern: string;
        flags?: string;
    };
    size?: {
        min?: number;
        max?: number;
    };
    range?: {
        min?: number;
        max?: number;
    };
    in?: string[];
    linkContentType?: string[];
    linkMimetypeGroup?: string[];
    enabledNodeTypes?: NodeType[];
    enabledMarks?: Mark[];
    message?: string;
}
export interface ContentfulFieldItems {
    type: string;
    linkType?: 'Entry' | 'Asset';
    validations?: ContentfulValidation[];
}
export type ContentfulField = ContentFields<KeyValueMap>;
export type ContentfulEnvironmentId = string;
export type ContentfulSpaceId = string;
