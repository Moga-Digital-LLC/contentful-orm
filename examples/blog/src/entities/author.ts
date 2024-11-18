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
    validations: [{
      size: {
        min: 2,
        max: 100
      }
    }]
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Text,
  })
  email!: string;

  @Field({
    type: ContentfulFieldType.RichText,
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
        enabledMarks: [
          'bold',
          'italic',
          'underline'
        ]
      }
    ]
  })
  bio!: any;

  @Field({
    type: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    validations: []
  })
  avatar!: any;
}
