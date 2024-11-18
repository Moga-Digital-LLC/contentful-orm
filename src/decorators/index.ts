import { ContentTypeOptions, FieldOptions } from '../types/index.js';

const contentTypeMetadataMap = new WeakMap<Function, ContentTypeOptions>();
const fieldMetadataMap = new WeakMap<Function, Map<string, FieldOptions>>();

export function ContentType(options: ContentTypeOptions) {
  return function contentTypeDecorator<T extends { new (...args: any[]): {} }>(target: T) {
    contentTypeMetadataMap.set(target, options);
    return target;
  };
}

export function Field(options: FieldOptions) {
  return function fieldDecorator(target: ClassAccessorDecoratorTarget<any, any>, context: ClassAccessorDecoratorContext) {
    const constructor = context.kind === 'getter' || context.kind === 'setter' 
      ? context.getClassConstructor()
      : context.target.constructor;
    
    const existingFields = fieldMetadataMap.get(constructor) || new Map<string, FieldOptions>();
    existingFields.set(context.name.toString(), options);
    fieldMetadataMap.set(constructor, existingFields);
  };
}

export function getContentTypeMetadata(target: Function): ContentTypeOptions | undefined {
  return contentTypeMetadataMap.get(target);
}

export function getFieldsMetadata(target: Function): Map<string, FieldOptions> {
  return fieldMetadataMap.get(target) || new Map<string, FieldOptions>();
}
