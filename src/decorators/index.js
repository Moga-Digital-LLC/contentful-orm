import 'reflect-metadata';
const CONTENT_TYPE_METADATA_KEY = 'contentful:content-type';
const FIELD_METADATA_KEY = 'contentful:field';
export function ContentType(options) {
    return (target) => {
        Reflect.defineMetadata(CONTENT_TYPE_METADATA_KEY, options, target);
    };
}
export function Field(options) {
    return (target, propertyKey) => {
        const existingFields = getFieldsMetadata(target.constructor) || new Map();
        existingFields.set(propertyKey.toString(), options);
        Reflect.defineMetadata(FIELD_METADATA_KEY, existingFields, target.constructor);
    };
}
export function getContentTypeMetadata(target) {
    return Reflect.getMetadata(CONTENT_TYPE_METADATA_KEY, target);
}
export function getFieldsMetadata(target) {
    return Reflect.getMetadata(FIELD_METADATA_KEY, target) || new Map();
}
