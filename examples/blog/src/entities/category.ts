import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

@ContentType({
  name: 'category',
  displayField: 'name',
  description: 'Category for blog posts'
})
export class Category {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [{ size: { min: 2, max: 50 } }]
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [{ size: { max: 200 } }]
  })
  description?: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      { size: { min: 2, max: 50 } },
      { regexp: { pattern: '^[a-z0-9-]+$' } }
    ]
  })
  slug!: string;

  @Field({
    type: ContentfulFieldType.Reference,
    required: false,
    linkType: 'Entry',
    validations: [{ linkContentType: ['category'] }]
  })
  parentCategory?: string;
}
