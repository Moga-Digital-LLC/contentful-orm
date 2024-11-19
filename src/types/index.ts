import { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId } from './contentful.js';

export const ContentfulFieldType = {
  Symbol: 'Symbol',
  Text: 'Text',
  RichText: 'RichText',
  Number: 'Number',
  Integer: 'Integer',
  Date: 'Date',
  Location: 'Location',
  Media: 'Media',
  Boolean: 'Boolean',
  Reference: 'Reference',
  Array: 'Array',
  Object: 'Object'
} as const;

export type ContentfulFieldTypeValues = typeof ContentfulFieldType[keyof typeof ContentfulFieldType];

export interface ContentTypeOptions {
  name: string;
  displayField: string;
  description?: string;
}

export interface BaseFieldOptions {
  required?: boolean;
  localized?: boolean;
  validations?: ContentfulValidation[];
  defaultValue?: any;
  disabled?: boolean;
  omitted?: boolean;
}

export interface LinkFieldOptions extends BaseFieldOptions {
  type: typeof ContentfulFieldType.Reference | typeof ContentfulFieldType.Media;
  linkType: 'Entry' | 'Asset';
  validations?: (ContentfulValidation & {
    linkContentType?: string[];
    linkMimetypeGroup?: string[];
  })[];
}

export interface MediaFieldOptions extends LinkFieldOptions {
  type: typeof ContentfulFieldType.Media;
  linkType: 'Asset';
  validations?: (ContentfulValidation & {
    linkMimetypeGroup?: string[];
  })[];
}

export interface ArrayFieldOptions extends BaseFieldOptions {
  type: typeof ContentfulFieldType.Array;
  itemsType: ContentfulFieldTypeValues;
  itemsLinkType?: 'Entry' | 'Asset';
  itemsValidations?: ContentfulValidation[];
}

export interface FieldOptions extends BaseFieldOptions {
  type: ContentfulFieldTypeValues;
  itemsType?: ContentfulFieldTypeValues;
  itemsLinkType?: 'Entry' | 'Asset';
  itemsValidations?: ContentfulValidation[];
  linkType?: 'Entry' | 'Asset';
}

export type { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId };
