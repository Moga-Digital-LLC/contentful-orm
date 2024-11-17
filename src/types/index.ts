export enum ContentfulFieldType {
  Text = 'Text',
  RichText = 'RichText',
  Number = 'Number',
  Date = 'Date',
  Location = 'Location',
  Media = 'Media',
  Boolean = 'Boolean',
  Reference = 'Link',
  Array = 'Array'
}

export interface ContentTypeOptions {
  name: string;
  displayField?: string;
  description?: string;
}

export interface FieldValidation {
  size?: { min?: number; max?: number };
  regexp?: { pattern: string; flags?: string };
  range?: { min?: number; max?: number };
  linkMimetypeGroup?: string[];
  linkContentType?: string[];
  enabledMarks?: string[];
  enabledNodeTypes?: string[];
}

export interface FieldOptions {
  type: ContentfulFieldType;
  required?: boolean;
  localized?: boolean;
  validations?: FieldValidation[];
  linkType?: string;
  itemsType?: ContentfulFieldType;
  itemsLinkType?: string;
  items?: {
    validations?: FieldValidation[];
  };
}

export interface ContentfulConfig {
  space: string;
  accessToken: string;
  environment?: string;
}
