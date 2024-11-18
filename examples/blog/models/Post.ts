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
  accessor title: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true
  })
  accessor content: string;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  accessor publishDate: Date;

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
  accessor tags: string[];
}

export default Post;
