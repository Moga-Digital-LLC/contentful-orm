import { ContentType, Field } from '../../../src/decorators/index.js';
import { ContentfulFieldType } from '../../../src/types/index.js';

@ContentType({
  name: 'blogPost',
  displayField: 'title',
  description: 'A blog post content type'
})
class Post {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      {
        size: {
          min: 3,
          max: 100
        }
      }
    ]
  })
  title: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true
  })
  content: string;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  publishDate: Date;

  @Field({
    type: ContentfulFieldType.Array,
    itemsType: ContentfulFieldType.Text,
    validations: [
      {
        size: {
          max: 10
        }
      }
    ]
  })
  tags: string[];
}

export default Post;
