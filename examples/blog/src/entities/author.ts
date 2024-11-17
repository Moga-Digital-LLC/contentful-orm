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
    validations: [{ size: { min: 2, max: 100 } }]
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: false
  })
  email!: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: false,
    validations: [
      {
        enabledNodeTypes: [
          'paragraph',
          'heading-1',
          'heading-2',
          'unordered-list',
          'ordered-list'
        ]
      },
      {
        enabledMarks: ['bold', 'italic', 'underline']
      }
    ]
  })
  bio!: string;

  @Field({
    type: ContentfulFieldType.Media,
    required: false,
    validations: [{ linkMimetypeGroup: ['image'] }]
  })
  avatar!: string;
}
