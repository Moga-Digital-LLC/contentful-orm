export { ContentfulSync } from './sync/index.js';
export type { 
  ContentfulField, 
  ContentfulValidation, 
  ContentfulEnvironmentId, 
  ContentfulSpaceId,
  BaseFieldOptions,
  FieldOptions,
  LinkFieldOptions,
  MediaFieldOptions,
  ArrayFieldOptions
} from './types/index.js';
export { 
  ContentType, 
  Field, 
  MediaField, 
  ReferenceField, 
  ArrayField,
  SymbolField,
  IntegerField,
  ObjectField,
  getContentTypeMetadata,
  getFieldsMetadata
} from './decorators/index.js';
export { ContentfulFieldType } from './types/index.js';
export { Validations } from './validations/index.js';

// Re-export commonly used types from contentful-management
export type {
  ContentFields,
  Entry,
  Asset,
  Space,
  Environment
} from 'contentful-management';
