import 'reflect-metadata';
import { ContentTypeOptions, FieldOptions } from '../types';

const CONTENT_TYPE_METADATA_KEY = 'contentful:content-type';
const FIELD_METADATA_KEY = 'contentful:field';

export function ContentType(options: ContentTypeOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(CONTENT_TYPE_METADATA_KEY, options, target);
  };
}

export function Field(options: FieldOptions): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fields = Reflect.getMetadata(FIELD_METADATA_KEY, target.constructor) || {};
    fields[propertyKey] = options;
    Reflect.defineMetadata(FIELD_METADATA_KEY, fields, target.constructor);
  };
}

export function getContentTypeMetadata(target: Function): ContentTypeOptions | undefined {
  return Reflect.getMetadata(CONTENT_TYPE_METADATA_KEY, target);
}

export function getFieldsMetadata(target: Function): Record<string, FieldOptions> {
  return Reflect.getMetadata(FIELD_METADATA_KEY, target) || {};
}
