import contentfulManagement from 'contentful-management';
import { ContentfulFieldType } from '../types/index.js';
import { getContentTypeMetadata, getFieldsMetadata } from '../decorators/index.js';
const CONTENTFUL_FIELD_TYPES = {
    [ContentfulFieldType.Text]: 'Symbol',
    [ContentfulFieldType.RichText]: 'RichText',
    [ContentfulFieldType.Number]: 'Number',
    [ContentfulFieldType.Date]: 'Date',
    [ContentfulFieldType.Location]: 'Location',
    [ContentfulFieldType.Media]: 'Link',
    [ContentfulFieldType.Boolean]: 'Boolean',
    [ContentfulFieldType.Reference]: 'Link',
    [ContentfulFieldType.Array]: 'Array'
};
export class ContentfulSync {
    client;
    space;
    environment;
    spaceId;
    environmentId;
    constructor(accessToken, spaceId, environmentId = 'master') {
        this.client = contentfulManagement.createClient({ accessToken });
        this.spaceId = spaceId;
        this.environmentId = environmentId;
        this.space = this.client.getSpace(spaceId);
        this.environment = this.space.then(space => space.getEnvironment(environmentId));
    }
    transformValidation(validation) {
        if (validation.regexp) {
            const { pattern, flags } = validation.regexp;
            return {
                ...validation,
                regexp: {
                    pattern,
                    flags: flags ?? ''
                }
            };
        }
        return validation;
    }
    transformFieldsToContentful(fieldsMap) {
        const fieldsMetadata = Object.fromEntries(fieldsMap);
        return Object.entries(fieldsMetadata).map(([id, options]) => {
            const field = {
                id,
                name: id,
                type: CONTENTFUL_FIELD_TYPES[options.type],
                required: options.required ?? false,
                localized: options.localized ?? false,
                validations: options.validations?.map((v) => this.transformValidation(v)) ?? []
            };
            if (options.type === ContentfulFieldType.Array && options.itemsType) {
                field.items = {
                    type: CONTENTFUL_FIELD_TYPES[options.itemsType],
                    validations: options.items?.validations?.map((v) => this.transformValidation(v)) ?? []
                };
                if (options.itemsLinkType) {
                    field.items.linkType = options.itemsLinkType;
                }
            }
            if (options.type === ContentfulFieldType.Reference || options.type === ContentfulFieldType.Media) {
                field.linkType = options.itemsLinkType ?? 'Entry';
            }
            return field;
        });
    }
    async syncContentType(entity) {
        const contentTypeMetadata = getContentTypeMetadata(entity);
        if (!contentTypeMetadata) {
            throw new Error(`No content type metadata found for ${entity.name}`);
        }
        console.log(`Syncing content type: ${contentTypeMetadata.name}`);
        const fieldsMetadata = getFieldsMetadata(entity);
        const fields = this.transformFieldsToContentful(fieldsMetadata);
        console.log('Transformed fields:', JSON.stringify(fields, null, 2));
        console.log(`Using space: ${this.spaceId}, environment: ${this.environmentId}`);
        const environment = await this.environment;
        try {
            console.log(`Checking if content type ${contentTypeMetadata.name} exists...`);
            const existingContentType = await environment.getContentType(contentTypeMetadata.name);
            console.log('Content type exists, updating...');
            // Unpublish first if published
            if (existingContentType.sys.publishedVersion) {
                console.log('Unpublishing content type...');
                await existingContentType.unpublish();
            }
            // Get the latest version after unpublishing
            const latestVersion = await environment.getContentType(contentTypeMetadata.name);
            const updatedContentType = await latestVersion.update({
                name: contentTypeMetadata.name,
                displayField: contentTypeMetadata.displayField,
                description: contentTypeMetadata.description,
                fields
            });
            console.log('Content type updated, publishing...');
            await updatedContentType.publish();
            console.log('Content type published successfully');
        }
        catch (error) {
            if (error instanceof Error && 'name' in error && error.name === 'NotFound') {
                console.log('Content type not found, creating new...');
                const contentType = await environment.createContentTypeWithId(contentTypeMetadata.name, {
                    name: contentTypeMetadata.name,
                    displayField: contentTypeMetadata.displayField,
                    description: contentTypeMetadata.description,
                    fields
                });
                console.log('Content type created, publishing...');
                await contentType.publish();
                console.log('Content type published successfully');
            }
            else {
                console.error('Error:', error);
                throw error;
            }
        }
    }
}
