import { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId } from './contentful.js';

export const ContentfulFieldType = {
  Text: 'Text',
  RichText: 'RichText',
  Number: 'Number',
  Date: 'Date',
  Location: 'Location',
  Media: 'Media',
  Boolean: 'Boolean',
  Reference: 'Reference',
  Array: 'Array'
} as const;

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
