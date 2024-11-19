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
    return Array.from(fieldsMap.entries()).map(([fieldName, options]) => {
      const field: any = {
        id: fieldName,
        name: fieldName,
        type: CONTENTFUL_FIELD_TYPES[options.type],
        required: options.required ?? false,
        localized: options.localized ?? false,
        validations: options.validations?.map(v => this.transformValidation(v)) ?? []
      };

      if (options.type === ContentfulFieldType.Array) {
        field.items = {
          type: CONTENTFUL_FIELD_TYPES[options.itemsType ?? ContentfulFieldType.Text],
          validations: options.itemsValidations?.map(v => this.transformValidation(v)) ?? []
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

  private async unpublishContentType(contentType: any) {
    try {
      if (contentType.isPublished()) {
        await contentType.unpublish();
      }
    } catch (error) {
      console.log('Content type was not published, continuing...');
    }
  }

  async syncContentType(target: Function) {
    const metadata = getContentTypeMetadata(target);
    if (!metadata) {
      throw new Error(`No content type metadata found for ${target.name}`);
    }

    const fields = this.transformFieldsToContentful(getFieldsMetadata(target));
    const contentType = {
      name: metadata.name,
      displayField: metadata.displayField,
      description: metadata.description,
      fields
    };

    const environment = await this.environment;
    try {
      // Get the latest version of the content type
      const existingContentType = await environment.getContentType(metadata.name);
      console.log(`Updating content type: ${metadata.name}`);
      
      // Unpublish first if published
      if (existingContentType.isPublished()) {
        console.log('Unpublishing content type...');
        await existingContentType.unpublish();
      }

      // Get the latest version after unpublishing
      const latestVersion = await environment.getContentType(metadata.name);
      console.log('Updating content type with latest version...');
      const updatedContentType = await latestVersion.update(contentType);
      
      // Publish the changes
      console.log('Publishing content type...');
      await updatedContentType.publish();
      
      console.log(`Successfully updated content type: ${metadata.name}`);
    } catch (error: any) {
      if (error.name === 'NotFound') {
        console.log(`Creating content type: ${metadata.name}`);
        const newContentType = await environment.createContentTypeWithId(metadata.name, contentType);
        await newContentType.publish();
        console.log(`Successfully created content type: ${metadata.name}`);
      } else {
        throw error;
      }
    }
  }
}
