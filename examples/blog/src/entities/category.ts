import 'reflect-metadata';
import { ContentType, Field, ContentfulFieldType, Validations } from 'contentful-orm';

@ContentType({
  name: 'category',
  displayField: 'name',
  description: 'Category for blog posts'
})
export class Category {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [Validations.size(3, 50)]
  })
  declare name: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      Validations.size(3, 50),
      Validations.regexp('^[a-z0-9-]+$', 'i')
    ]
  })
  declare slug: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [Validations.size(undefined, 200)]
  })
  declare description?: string;
}
