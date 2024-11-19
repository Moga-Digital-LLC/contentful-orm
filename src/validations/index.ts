import { ContentfulValidation, NodeType, Mark } from '../types/contentful.js';

export const Validations = {
  size: (min?: number, max?: number): ContentfulValidation => ({
    size: { min, max }
  }),

  range: (min?: number, max?: number): ContentfulValidation => ({
    range: { min, max }
  }),

  unique: (unique: boolean = true): ContentfulValidation => ({
    unique
  }),

  regexp: (pattern: string, flags?: string): ContentfulValidation => ({
    regexp: { pattern, flags }
  }),

  in: (values: string[]): ContentfulValidation => ({
    in: values
  }),

  linkContentType: (contentTypes: string[]): ContentfulValidation => ({
    linkContentType: contentTypes
  }),

  linkMimetypeGroup: (mimetypes: string[]): ContentfulValidation => ({
    linkMimetypeGroup: mimetypes
  }),

  enabledNodeTypes: (nodeTypes: NodeType[]): ContentfulValidation => ({
    enabledNodeTypes: nodeTypes
  }),

  enabledMarks: (marks: Mark[]): ContentfulValidation => ({
    enabledMarks: marks
  })
} as const;
