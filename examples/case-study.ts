import { ContentType, MediaField, ReferenceField, ArrayField, Field } from '../src/decorators/index.js';
import { ContentfulFieldType } from '../src/types/index.js';
import { Validations } from '../src/validations/index.js';

@ContentType({
  name: 'caseStudy',
  displayField: 'title',
  description: 'A case study showcasing our work'
})
export class CaseStudy {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [
      Validations.size(10, 100)
    ]
  })
  declare title: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true,
    validations: [
      Validations.enabledMarks(['bold', 'italic', 'underline']),
      Validations.enabledNodeTypes(['paragraph', 'heading-1', 'heading-2', 'ordered-list', 'unordered-list'])
    ]
  })
  declare content: any;

  @MediaField({
    required: true,
    validations: [
      Validations.linkMimetypeGroup(['image'])
    ]
  })
  declare featuredImage: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    required: false,
    itemsValidations: [
      Validations.linkMimetypeGroup(['image'])
    ]
  })
  declare gallery?: any[];

  @ReferenceField({
    linkType: 'Entry',
    required: true,
    validations: [
      Validations.linkContentType(['category'])
    ]
  })
  declare primaryCategory: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    itemsValidations: [
      Validations.linkContentType(['tag'])
    ]
  })
  declare tags?: any[];
}
