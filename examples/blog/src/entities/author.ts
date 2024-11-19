import 'reflect-metadata';
import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

@ContentType({
  name: 'author',
  displayField: 'name',
  description: 'Author of blog posts'
})
export class Author {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [{ size: { min: 3, max: 100 } }]
  })
  declare name: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false
  })
  declare title?: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [{ size: { max: 500 } }]
  })
  declare bio?: string;

  @Field({
    type: ContentfulFieldType.Media,
    required: false,
    validations: [
      {
        linkMimetypeGroup: ['image']
      }
    ]
  })
  declare avatar?: any;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [
      {
        regexp: {
          pattern: '^https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$',
          flags: 'i'
        }
      }
    ]
  })
  declare website?: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [
      {
        regexp: {
          pattern: '^https?://twitter\\.com/[\\w\\-]+/?$',
          flags: 'i'
        }
      }
    ]
  })
  declare twitter?: string;
}
