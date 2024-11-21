# Contentful ORM

A TypeScript-first ORM for Contentful CMS that enables a code-first approach to content modeling. Define your content types using TypeScript decorators and automatically sync them with Contentful.

## Features

- 🎯 Code-First Development
- 📝 TypeScript Stage 3 Decorators
- 🔄 Automatic Content Type Synchronization
- 🛠️ CLI Tools
- 💪 Type Safety
- 🌐 Localization Support
- 🔗 Reference Field Support
- ✨ Rich Text Support

## Supported Field Types

The following field types are supported:

- `Symbol` - For short text content (Contentful's Symbol type)
- `Text` - For long text content (Contentful's Text type)
- `RichText` - For rich text content with formatting
- `Number` - For decimal numbers
- `Integer` - For whole numbers
- `Date` - For date and time values
- `Location` - For geographical coordinates
- `Media` - For media assets (images, videos, etc.)
- `Boolean` - For true/false values
- `Reference` - For references to other content types
- `Array` - For arrays of any other supported type
- `Object` - For JSON objects

Each field type can be configured with additional options:

```typescript
@Field({
  type: ContentfulFieldType.Text,     // The field type
  required: true,                     // Whether the field is required
  localized: false,                   // Whether the field supports localization
  validations: [],                    // Array of validation rules
  disabled: false,                    // Whether the field is read-only
  omitted: false,                     // Whether the field is hidden
  // Array-specific options
  itemsType: ContentfulFieldType.Text,    // Type of array items (for Array type)
  itemsValidations: [],                   // Validations for array items
  itemsLinkType: 'Entry'                  // Link type for Reference/Media arrays
})
```

## Specialized Field Decorators

For better type safety and developer experience, specialized decorators are available for different field types:

### Basic Fields

```typescript
@SymbolField({
  required: true,
  validations: [
    Validations.size(1, 50)
  ]
})
declare name: string;

@IntegerField({
  required: true,
  validations: [
    Validations.range(0, 100)
  ]
})
declare quantity: number;

@ObjectField()
declare metadata: Record<string, any>;
```

### Media Fields

```typescript
@MediaField({
  required: true,
  validations: [
    Validations.linkMimetypeGroup(['image'])
  ]
})
declare featuredImage: any;
```

### Reference Fields

```typescript
@ReferenceField({
  linkType: 'Entry',
  required: true,
  validations: [
    Validations.linkContentType(['category'])
  ]
})
declare category: any;
```

### Array Fields

```typescript
@ArrayField({
  itemsType: ContentfulFieldType.Media,
  itemsLinkType: 'Asset',
  itemsValidations: [
    Validations.linkMimetypeGroup(['image'])
  ]
})
declare gallery?: any[];
```

## Validation Builders

The library provides type-safe validation builders to help prevent runtime errors:

```typescript
import { Validations } from 'contentful-orm';

// Text validations
Validations.size(10, 100)           // Min/max length
Validations.regexp('^[A-Z]', 'i')   // Regular expression with flags
Validations.unique()                // Unique value

// Number validations
Validations.range(0, 100)           // Min/max value

// Link validations
Validations.linkContentType(['category', 'author'])  // Valid content types
Validations.linkMimetypeGroup(['image', 'video'])    // Valid mime types

// Rich text validations
Validations.enabledMarks(['bold', 'italic'])         // Allowed formatting
Validations.enabledNodeTypes(['paragraph', 'heading-1']) // Allowed blocks
```

## Complete Example

Here's a complete example of a Product content type using all available field types:

```typescript
@ContentType({
  name: 'product',
  displayField: 'name',
  description: 'A product with all available field types'
})
export class Product {
  @SymbolField({
    required: true,
    validations: [
      Validations.size(1, 50)
    ]
  })
  declare name: string;

  @Field({
    type: ContentfulFieldType.Text,
    required: true
  })
  declare description: string;

  @Field({
    type: ContentfulFieldType.RichText,
    validations: [
      Validations.enabledMarks(['bold', 'italic']),
      Validations.enabledNodeTypes(['paragraph', 'heading-1'])
    ]
  })
  declare details: any;

  @IntegerField({
    required: true,
    validations: [
      Validations.range(0)
    ]
  })
  declare quantity: number;

  @Field({
    type: ContentfulFieldType.Number,
    validations: [
      Validations.range(0.01)
    ]
  })
  declare price: number;

  @Field({
    type: ContentfulFieldType.Date,
    required: true
  })
  declare releaseDate: Date;

  @Field({
    type: ContentfulFieldType.Location
  })
  declare storeLocation: any;

  @MediaField({
    required: true,
    validations: [
      Validations.linkMimetypeGroup(['image'])
    ]
  })
  declare image: any;

  @Field({
    type: ContentfulFieldType.Boolean,
    required: true
  })
  declare isAvailable: boolean;

  @ReferenceField({
    linkType: 'Entry',
    validations: [
      Validations.linkContentType(['category'])
    ]
  })
  declare category: any;

  @ArrayField({
    itemsType: ContentfulFieldType.Reference,
    itemsLinkType: 'Entry',
    itemsValidations: [
      Validations.linkContentType(['tag'])
    ]
  })
  declare tags: any[];

  @ObjectField()
  declare metadata: Record<string, any>;

  @Field({
    type: ContentfulFieldType.Text,
    disabled: true
  })
  declare sku: string;

  @Field({
    type: ContentfulFieldType.Text,
    omitted: true
  })
  declare internalNotes: string;
}

## Examples

The repository includes several examples to help you get started:

### Blog Example
A complete example of a blog implementation using Contentful ORM. Located in `/examples/blog`, this example demonstrates:
- Full project structure
- Entity definitions
- Environment configuration
- TypeScript configuration

### Case Study Example
A single-file example (`/examples/case-study.ts`) showing how to define a case study content type with:
- Rich text content
- Media fields
- Reference fields
- Field validations

### Direct TypeScript Example
Located in `/examples/direct-ts`, this example demonstrates direct TypeScript usage of the ORM.

For more details, check out the examples in the repository's `/examples` directory.

## Requirements

- TypeScript 5.2 or higher
- Node.js 18 or higher

## Setup Guide

### Installation

```bash
# Using npm
npm install contentful-orm reflect-metadata cross-env ts-node --save-dev

# Using pnpm
pnpm add contentful-orm reflect-metadata cross-env ts-node -D

# Using yarn
yarn add contentful-orm reflect-metadata cross-env ts-node --dev
```

### Configuration

#### 1. Environment Variables

Create a `.env` file in your project root:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_management_access_token
CONTENTFUL_ENVIRONMENT_ID=master  # or your preferred environment
```

> **Important**: The `CONTENTFUL_ACCESS_TOKEN` should be a Management Access Token, not a Content Delivery/Preview token. You can generate one from Contentful's web app under Settings > API Keys > Content management tokens.

#### 2. TypeScript Configuration

Your `tsconfig.json` must include the following settings for decorators and metadata to work properly:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ESNext"
  }
}
```

#### 3. Package Configuration

Update your `package.json` to include the following scripts:

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && tsc",
    "sync": "npm run build && contentful-orm sync --path=\"dist/entities/**/*.js\""
  }
}
```

Install the required dev dependencies:

```bash
pnpm add -D rimraf
```

### Entity Setup

1. Create your entity files with `.ts` extension in your entities directory
2. Export all entities from an `index.ts` file

Example entity structure:
```typescript
// src/entities/author.ts
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
      size: { min: 2, max: 100 }
    }]
  })
  name!: string;
}
```

### Running the Sync

After setting up your entities and configuration:

1. Build your TypeScript files:
```bash
pnpm build
```

2. Run the sync command:
```bash
pnpm sync
```

The sync process will:
- Build your TypeScript files
- Find all entity files in the specified path
- Create or update content types in Contentful
- Handle versioning and publishing automatically

### Troubleshooting

If you encounter sync issues:
1. Ensure your Management Access Token has the correct permissions
2. Check that all import paths use `.js` extensions
3. Verify that your TypeScript configuration includes decorator and metadata settings
4. Make sure all array field validations use `itemsValidations` instead of `items`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

https://github.com/Moga-Digital-LLC/contentful-orm

## License

MIT
