import { ContentType, Field, MediaField, ReferenceField, ArrayField, ContentfulFieldType, Validations, SymbolField, IntegerField, ObjectField } from 'contentful-orm';

// Example 1: Text and Rich Text Fields
@ContentType({
  name: 'article',
  displayField: 'title',
  description: 'Simple article with title and content'
})
export class Article {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [Validations.size(3, 100)]
  })
  title!: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true,
    validations: [
      Validations.enabledMarks(['bold', 'italic', 'underline']),
      Validations.enabledNodeTypes([
        'paragraph',
        'heading-1',
        'heading-2',
        'ordered-list',
        'unordered-list',
        'blockquote'
      ])
    ]
  })
  content!: any;
}

// Example 2: Numeric and Date Fields
@ContentType({
  name: 'product',
  displayField: 'name',
  description: 'Product with price and release date'
})
export class Product {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Number,
    required: true,
    validations: [Validations.range(0)]
  })
  price!: number;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  releaseDate!: Date;
}

// Example 3: Location and Media Fields
@ContentType({
  name: 'store',
  displayField: 'name',
  description: 'Store location with image'
})
export class Store {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Location,
    required: true
  })
  location!: any;

  @MediaField({
    required: true,
    validations: [Validations.linkMimetypeGroup(['image'])]
  })
  storeImage!: any;
}

// Example 4: Boolean and Reference Fields
@ContentType({
  name: 'subscription',
  displayField: 'planName',
  description: 'Subscription plan with features'
})
export class Subscription {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  planName!: string;

  @Field({
    type: ContentfulFieldType.Boolean,
    required: true
  })
  isActive!: boolean;

  @ReferenceField({
    linkType: 'Entry',
    required: true,
    validations: [Validations.linkContentType(['product'])]
  })
  product!: any;
}

// Example 5: Array Fields
@ContentType({
  name: 'gallery',
  displayField: 'title',
  description: 'Photo gallery with tags and locations'
})
export class Gallery {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  title!: string;

  @ArrayField({
    itemsType: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    required: true,
    itemsValidations: [Validations.linkMimetypeGroup(['image'])]
  })
  images!: any[];

  @ArrayField({
    itemsType: ContentfulFieldType.Text,
    required: false,
    itemsValidations: [Validations.size(1, 20)]
  })
  tags!: string[];

  @ArrayField({
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    itemsValidations: [Validations.linkContentType(['store'])]
  })
  locations!: any[];
}

// Example 6: Event with Date Range and Attendees
@ContentType({
  name: 'event',
  displayField: 'name',
  description: 'Event with date range and attendees'
})
export class Event {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  name!: string;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  startDate!: Date;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  endDate!: Date;

  @Field({
    type: ContentfulFieldType.Location,
    required: true
  })
  location!: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    required: false,
    itemsValidations: [Validations.linkContentType(['person'])]
  })
  attendees!: any[];
}

// Example 7: Advanced Product with all field types
@ContentType({
  name: 'advancedProduct',
  displayField: 'name',
  description: 'Advanced product content type demonstrating all field types'
})
export class AdvancedProduct {
  @SymbolField({ required: true })
  name!: string;

  @IntegerField()
  stock!: number;

  @ObjectField()
  metadata!: Record<string, any>;

  @Field({
    type: ContentfulFieldType.Text
  })
  sku!: string;

  @Field({
    type: ContentfulFieldType.Text
  })
  internalNotes!: string;
}
