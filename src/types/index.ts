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

export type ContentfulFieldTypeValues = typeof ContentfulFieldType[keyof typeof ContentfulFieldType];

export interface ContentTypeOptions {
  name: string;
  displayField: string;
  description?: string;
}

export interface FieldOptions {
  type: ContentfulFieldTypeValues;
  required?: boolean;
  localized?: boolean;
  validations?: ContentfulValidation[];
  itemsType?: ContentfulFieldTypeValues;
  itemsLinkType?: 'Entry' | 'Asset';
  itemsValidations?: ContentfulValidation[];
  defaultValue?: any;
}

export type { ContentfulField, ContentfulValidation, ContentfulEnvironmentId, ContentfulSpaceId };
