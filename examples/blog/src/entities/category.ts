import 'reflect-metadata';
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
    validations: [{ size: { min: 3, max: 50 } }]
  })
  declare name: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      { size: { min: 3, max: 50 } },
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
    required: false,
    validations: [{ size: { max: 200 } }]
  })
  declare description?: string;
}
