import 'reflect-metadata';
import { ContentTypeOptions, FieldOptions } from '../types/index.js';

// Decorator metadata keys
const CONTENT_TYPE_KEY = 'contentful:content-type';
const FIELD_KEY = 'contentful:field';

export function ContentType(options: ContentTypeOptions) {
  return function (target: any) {
    Reflect.defineMetadata(CONTENT_TYPE_KEY, options, target);
    return target;
  };
}

export function Field(options: FieldOptions) {
  return function (target: any, propertyKey: string | symbol) {
    const fields = Reflect.getMetadata(FIELD_KEY, target.constructor) || new Map<string, FieldOptions>();
    fields.set(propertyKey.toString(), options);
    Reflect.defineMetadata(FIELD_KEY, fields, target.constructor);
  };
}

export function getContentTypeMetadata(target: any): ContentTypeOptions | undefined {
  return Reflect.getMetadata(CONTENT_TYPE_KEY, target);
}

export function getFieldsMetadata(target: any): Map<string, FieldOptions> {
  return Reflect.getMetadata(FIELD_KEY, target) || new Map<string, FieldOptions>();
}
