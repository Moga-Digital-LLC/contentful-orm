import { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId } from './contentful.js';
export declare const ContentfulFieldType: {
    readonly Text: "Text";
    readonly RichText: "RichText";
    readonly Number: "Number";
    readonly Date: "Date";
    readonly Location: "Location";
    readonly Media: "Media";
    readonly Boolean: "Boolean";
    readonly Reference: "Reference";
    readonly Array: "Array";
};
export interface ContentTypeOptions {
    name: string;
    displayField: string;
    description?: string;
}
export interface FieldOptions {
    type: typeof ContentfulFieldType[keyof typeof ContentfulFieldType];
    required?: boolean;
    localized?: boolean;
    validations?: ContentfulValidation[];
    itemsType?: typeof ContentfulFieldType[keyof typeof ContentfulFieldType];
    itemsLinkType?: 'Entry' | 'Asset';
    items?: {
        validations?: ContentfulValidation[];
    };
}
export type { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId };
