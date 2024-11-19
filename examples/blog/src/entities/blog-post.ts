import 'reflect-metadata';
import { ContentType, Field, MediaField, ReferenceField, ArrayField, ContentfulFieldType, Validations } from 'contentful-orm';

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
    validations: [Validations.size(10, 200)]
  })
  declare title: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      Validations.size(5, 100),
      Validations.regexp('^[a-z0-9-]+$', 'i')
    ]
  })
  declare slug: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    localized: true,
    validations: [Validations.size(50, 500)]
  })
  declare summary: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true,
    localized: true,
    validations: [
      Validations.enabledMarks(['bold', 'italic', 'underline']),
      Validations.enabledNodeTypes([
        'paragraph',
        'heading-1',
        'heading-2',
        'heading-3',
        'ordered-list',
        'unordered-list',
        'hr',
        'blockquote',
        'embedded-entry-block',
        'embedded-asset-block',
        'hyperlink',
        'entry-hyperlink',
        'asset-hyperlink'
      ])
    ]
  })
  declare content: any;

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

  @ArrayField({
    itemsType: ContentfulFieldType.Text,
    required: false,
    itemsValidations: [Validations.size(2, 20)]
  })
  declare tags?: string[];

  @ReferenceField({
    linkType: 'Entry',
    required: true,
    validations: [Validations.linkContentType(['author'])]
  })
  declare author: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    itemsValidations: [Validations.linkContentType(['category'])]
  })
  declare categories?: any[];

  @MediaField({
    required: false,
    validations: [Validations.linkMimetypeGroup(['image'])]
  })
  declare featuredImage?: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    required: false,
    itemsValidations: [Validations.linkMimetypeGroup(['image'])]
  })
  declare gallery?: any[];
}
