import 'reflect-metadata';
import { ContentTypeOptions, FieldOptions } from '../types/index.js';
export declare function ContentType(options: ContentTypeOptions): ClassDecorator;
export declare function Field(options: FieldOptions): PropertyDecorator;
export declare function getContentTypeMetadata(target: Function): ContentTypeOptions | undefined;
export declare function getFieldsMetadata(target: Function): Map<string, FieldOptions>;
