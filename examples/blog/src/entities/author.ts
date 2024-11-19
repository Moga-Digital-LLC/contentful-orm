import 'reflect-metadata';
import { ContentType, Field, MediaField, ContentfulFieldType, Validations } from 'contentful-orm';

@ContentType({
  name: 'author',
  displayField: 'name',
  description: 'Author of blog posts'
})
export class Author {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [Validations.size(3, 100)]
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
    validations: [Validations.size(undefined, 500)]
  })
  declare bio?: string;

  @MediaField({
    required: false,
    validations: [Validations.linkMimetypeGroup(['image'])]
  })
  declare avatar?: any;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [
      Validations.regexp('^https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', 'i')
    ]
  })
  declare website?: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false,
    validations: [
      Validations.regexp('^@[\\w\\-]+$')
    ]
  })
  declare twitter?: string;
}
