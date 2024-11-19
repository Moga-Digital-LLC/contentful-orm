import 'reflect-metadata';
import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

@ContentType({
  name: 'blogPost',
  displayField: 'title',
  description: 'A blog post entry'
})
export class BlogPost {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [{ size: { min: 3, max: 100 } }]
  })
  declare title: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true
  })
  declare content: string;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  declare publishDate: Date;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Text,
    itemsValidations: [
      {
        size: { min: 2, max: 20 }
      }
    ]
  })
  declare tags?: string[];
}
