import { createClient } from 'contentful-management';
import { ContentTypeOptions, FieldOptions, ContentfulFieldType } from '../types';
import { getContentTypeMetadata, getFieldsMetadata } from '../decorators';

const CONTENTFUL_FIELD_TYPES: Record<string, string> = {
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

interface ContentfulField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  localized: boolean;
  validations: any[];
  linkType?: string;
  items?: {
    type: string;
    linkType?: string;
    validations?: any[];
  };
}

export class ContentfulSync {
  private client;

  constructor(accessToken: string) {
    this.client = createClient({ accessToken });
  }

  async syncContentType(entity: Function, spaceId: string, environmentId: string = 'master') {
    const contentTypeMetadata = getContentTypeMetadata(entity);
    if (!contentTypeMetadata) {
      throw new Error(`No content type metadata found for ${entity.name}`);
    }

    console.log(`Syncing content type: ${contentTypeMetadata.name}`);
    const fieldsMetadata = getFieldsMetadata(entity);
    const fields = this.transformFieldsToContentful(fieldsMetadata);
    console.log('Transformed fields:', JSON.stringify(fields, null, 2));

    const space = await this.client.getSpace(spaceId);
    console.log('Connected to space:', spaceId);
    const environment = await (space.getEnvironment as any)(environmentId || 'master');
    console.log('Connected to environment:', environmentId || 'master');

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
    } catch (error: any) {
      if (error?.name === 'NotFound') {
        console.log('Content type not found, creating new...');
        const contentType = await environment.createContentTypeWithId(
          contentTypeMetadata.name,
          {
            name: contentTypeMetadata.name,
            displayField: contentTypeMetadata.displayField,
            description: contentTypeMetadata.description,
            fields: fields as any
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

  private transformFieldsToContentful(fieldsMetadata: Record<string, FieldOptions>): ContentfulField[] {
    return Object.entries(fieldsMetadata).map(([id, options]) => {
      const field: ContentfulField = {
        id,
        name: id,
        type: CONTENTFUL_FIELD_TYPES[options.type] || options.type,
        required: options.required || false,
        localized: options.localized || false,
        validations: options.validations || []
      };

      if (options.type === ContentfulFieldType.Media || options.type === ContentfulFieldType.Reference) {
        field.linkType = options.type === ContentfulFieldType.Media ? 'Asset' : 'Entry';
      }

      if (options.type === ContentfulFieldType.Array && options.itemsType) {
        field.items = {
          type: CONTENTFUL_FIELD_TYPES[options.itemsType] || options.itemsType,
          ...(options.itemsLinkType && { linkType: options.itemsLinkType }),
          ...(options.items?.validations && { validations: options.items.validations })
        };
      }

      return field;
    });
  }
}
