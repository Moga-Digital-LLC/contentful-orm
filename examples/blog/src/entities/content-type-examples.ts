import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

// Example 1: Text and Rich Text Fields
@ContentType({
  name: 'article',
  displayField: 'title',
  description: 'Article with various text fields'
})
export class Article {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [{ size: { min: 3, max: 100 } }]
  })
  title!: string;

  @Field({
    type: ContentfulFieldType.RichText,
    required: true
  })
  content!: any; // Rich text is represented as a complex object
}

// Example 2: Numeric and Date Fields
@ContentType({
  name: 'product',
  displayField: 'name',
  description: 'Product with price and dates'
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
    validations: [{ range: { min: 0 } }]
  })
  price!: number;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  releaseDate!: string; // ISO date string
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
  location!: {
    lat: number;
    lon: number;
  };

  @Field({
    type: ContentfulFieldType.Media,
    required: false,
    validations: [
      {
        linkMimetypeGroup: ['image']
      }
    ]
  })
  storeImage!: any; // Asset reference
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

  @Field({
    type: ContentfulFieldType.Reference,
    required: false,
    validations: [
      {
        linkContentType: ['product']
      }
    ]
  })
  relatedProduct!: any; // Reference to Product
}

// Example 5: Array Fields
@ContentType({
  name: 'gallery',
  displayField: 'title',
  description: 'Photo gallery with multiple images and tags'
})
export class Gallery {
  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  title!: string;

  @Field({
    type: ContentfulFieldType.Array,
    required: false,
    itemsType: ContentfulFieldType.Media,
    itemsLinkType: 'Asset',
    items: {
      validations: [
        {
          linkMimetypeGroup: ['image']
        }
      ]
    }
  })
  images!: any[]; // Array of image assets

  @Field({
    type: ContentfulFieldType.Array,
    required: false,
    itemsType: ContentfulFieldType.Text,
    items: {
      validations: [
        {
          size: { min: 1, max: 20 }
        }
      ]
    }
  })
  tags!: string[];

  @Field({
    type: ContentfulFieldType.Array,
    required: false,
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    items: {
      validations: [
        {
          linkContentType: ['store']
        }
      ]
    }
  })
  locations!: any[]; // Array of Store references
}
