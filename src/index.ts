export { ContentfulSync } from './sync/index.js';
export type { 
  ContentfulField, 
  ContentfulValidation, 
  ContentfulEnvironmentId, 
  ContentfulSpaceId 
} from './types/index.js';
export { ContentType, Field } from './decorators/index.js';
export { ContentfulFieldType } from './types/index.js';

// Re-export commonly used types from contentful-management
export type {
  ContentFields,
  Entry,
  Asset,
  Space,
  Environment
} from 'contentful-management';
