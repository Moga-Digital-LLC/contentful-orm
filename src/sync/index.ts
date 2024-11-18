import contentfulManagement from 'contentful-management';
import { ContentTypeOptions, FieldOptions, ContentfulFieldType } from '../types/index.js';
import { getContentTypeMetadata, getFieldsMetadata } from '../decorators/index.js';
import { ContentfulValidation, ContentfulSpaceId, ContentfulEnvironmentId } from '../types/contentful.js';

type ContentTypeFieldValidation = any;
type ContentFields<T> = any;

const CONTENTFUL_FIELD_TYPES: Record<typeof ContentfulFieldType[keyof typeof ContentfulFieldType], string> = {
  [ContentfulFieldType.Text]: 'Symbol',
  [ContentfulFieldType.RichText]: 'RichText',
  [ContentfulFieldType.Number]: 'Number',
  [ContentfulFieldType.Date]: 'Date',
  [ContentfulFieldType.Location]: 'Location',
  [ContentfulFieldType.Media]: 'Link',
  [ContentfulFieldType.Boolean]: 'Boolean',
  [ContentfulFieldType.Reference]: 'Link',
  [ContentfulFieldType.Array]: 'Array'
} as const;

export class ContentfulSync {
  private readonly client: ReturnType<typeof contentfulManagement.createClient>;
  private readonly space: Promise<any>;
  private readonly environment: Promise<any>;
  private readonly spaceId: ContentfulSpaceId;
  private readonly environmentId: ContentfulEnvironmentId;

  constructor(accessToken: string, spaceId: ContentfulSpaceId, environmentId: ContentfulEnvironmentId = 'master') {
    this.client = contentfulManagement.createClient({ accessToken });
    this.spaceId = spaceId;
    this.environmentId = environmentId;
    this.space = this.client.getSpace(spaceId);
    this.environment = this.space.then(space => space.getEnvironment(environmentId));
  }

  private transformValidation(validation: ContentfulValidation): ContentTypeFieldValidation {
    if (validation.regexp) {
      const { pattern, flags } = validation.regexp;
      return {
        ...validation,
        regexp: {
          pattern,
          flags: flags ?? ''
        }
      } as ContentTypeFieldValidation;
    }
    return validation as ContentTypeFieldValidation;
  }

  private transformFieldsToContentful(fieldsMap: Map<string, FieldOptions>) {
    const fieldsMetadata = Object.fromEntries(fieldsMap);
    return Object.entries(fieldsMetadata).map(([id, options]) => {
      const field: ContentFields<any> = {
        id,
        name: id,
        type: CONTENTFUL_FIELD_TYPES[options.type],
        required: options.required ?? false,
        localized: options.localized ?? false,
        validations: options.validations?.map((v: ContentfulValidation) => this.transformValidation(v)) ?? []
      };

      if (options.type === ContentfulFieldType.Array && options.itemsType) {
        field.items = {
          type: CONTENTFUL_FIELD_TYPES[options.itemsType],
          validations: options.items?.validations?.map((v: ContentfulValidation) => this.transformValidation(v)) ?? []
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

  async syncContentType(entity: Function): Promise<void> {
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
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'NotFound') {
        console.log('Content type not found, creating new...');
        const contentType = await environment.createContentTypeWithId(
          contentTypeMetadata.name,
          {
            name: contentTypeMetadata.name,
            displayField: contentTypeMetadata.displayField,
            description: contentTypeMetadata.description,
            fields
          }
        );
        console.log('Content type created, publishing...');
        await contentType.publish();
        console.log('Content type published successfully');
      } else {
        console.error('Error:', error);
        throw error;
      }
    }
  }
}
