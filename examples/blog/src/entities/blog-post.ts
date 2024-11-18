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
  title!: string;

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
  slug!: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true,
    validations: [
      {
        enabledNodeTypes: [
          'heading-1',
          'heading-2',
          'heading-3',
          'paragraph',
          'blockquote',
          'embedded-asset-block',
          'unordered-list',
          'ordered-list',
          'hr'
        ]
      },
      {
        enabledMarks: ['bold', 'italic', 'underline']
      }
    ]
  })
  content!: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    localized: true,
    validations: [{ size: { max: 300 } }]
  })
  excerpt?: string;

  @Field({
    type: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    validations: []
  })
  featuredImage!: any;

  @Field({
    type: ContentfulFieldType.Reference,
    required: true,
    validations: [
      {
        linkContentType: ['author']
      }
    ]
  })
  author!: string;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    validations: [
      {
        size: { min: 1, max: 5 }
      }
    ],
    items: {
      validations: [
        {
          linkContentType: ['category']
        }
      ]
    }
  })
  categories!: string[];

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  publishDate!: string;

  @Field({
    type: ContentfulFieldType.Boolean,
    required: true
  })
  featured!: boolean;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Text,
    required: false,
    validations: [
      {
        size: { max: 10 }
      }
    ]
  })
  tags?: string[];

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    validations: [
      {
        size: { max: 3 }
      }
    ],
    items: {
      validations: [
        {
          linkContentType: ['blogPost']
        }
      ]
    }
  })
  relatedPosts?: string[];
}
