import 'reflect-metadata';
import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

@ContentType({
  name: 'blogPost',
  displayField: 'title',
  description: 'A blog post entry with rich content'
})
export class BlogPost {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    localized: true,
    validations: [{ size: { min: 10, max: 200 } }]
  })
  declare title: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      { size: { min: 5, max: 100 } },
      {
        regexp: {
          pattern: '^[a-z0-9-]+$',
          flags: 'i'
        }
      }
    ]
  })
  declare slug: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    localized: true,
    validations: [{ size: { min: 50, max: 500 } }]
  })
  declare summary: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true,
    localized: true
  })
  declare content: string;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  declare publishDate: Date;

  @Field({
    type: ContentfulFieldType.Boolean,
    required: true
  })
  declare featured: boolean;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Text,
    required: false,
    itemsValidations: [
      {
        size: { min: 2, max: 20 }
      }
    ]
  })
  declare tags?: string[];

  @Field({
    type: ContentfulFieldType.Reference,
    required: true,
    validations: [
      {
        linkContentType: ['author']
      }
    ]
  })
  declare author: any;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Reference,
    required: false,
    itemsValidations: [
      {
        linkContentType: ['category']
      }
    ]
  })
  declare categories?: any[];

  @Field({
    type: ContentfulFieldType.Media,
    required: false,
    validations: [
      {
        linkMimetypeGroup: ['image']
      }
    ]
  })
  declare featuredImage?: any;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Media,
    required: false,
    itemsValidations: [
      {
        linkMimetypeGroup: ['image']
      }
    ]
  })
  declare gallery?: any[];

  @Field({
    type: ContentfulFieldType.Location,
    required: false
  })
  declare location?: {
    lat: number;
    lon: number;
  };
}
