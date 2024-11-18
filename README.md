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

## Requirements

- TypeScript 5.2 or higher
- Node.js 16 or higher

## Installation

```bash
npm install contentful-orm
```

## Configuration

1. Configure TypeScript to use Stage 3 decorators in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": false,
    "emitDecoratorMetadata": false,
    "decorators": {
      "version": "2023-05"
    }
  }
}
```

2. Configure your Contentful credentials:

Create a `.env` file:
```env
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-management-token
CONTENTFUL_ENVIRONMENT=master # optional, defaults to 'master'
```

## Quick Start

1. Define your content types using accessor properties:

```typescript
import { ContentType, Field, ContentfulFieldType } from 'contentful-orm';

@ContentType({
  name: 'blogPost',
  displayField: 'title',
  description: 'A blog post entry'
})
class BlogPost {
  @Field({
    type: ContentfulFieldType.Text,
    required: true,
    validations: [{ size: { min: 3, max: 512 } }]
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
  accessor publishDate: string;

  @Field({
    type: ContentfulFieldType.Reference,
    linkType: 'Entry',
    validations: [{ linkContentType: ['author'] }]
  })
  accessor author: string;
}
```

2. Sync your content types with Contentful:

```bash
npx contentful-orm sync --path="src/entities/**/*.ts"
```

## Field Types

All Contentful field types are supported:

- Text
- RichText
- Number
- Date
- Location
- Media
- Boolean
- Reference (Link)
- Array

## Field Options

Each field can be configured with various options:

```typescript
@Field({
  type: ContentfulFieldType.Text,
  required: true,
  localized: true,
  validations: [
    { size: { min: 5, max: 100 } },
    { regexp: { pattern: '^[A-Za-z0-9]+$' } }
  ]
})
accessor title: string;
```

## CLI Usage

The CLI tool provides several commands for managing your content types:

```bash
# Sync all content types
npx contentful-orm sync

# Sync specific path
npx contentful-orm sync --path="src/models/*.ts"

# Sync to specific environment
npx contentful-orm sync --environment="staging"
```

## Best Practices

### Decorator Usage
- Use `accessor` keyword for all properties decorated with `@Field`
- Keep decorators simple and focused
- Use appropriate field types and validations

### Naming Conventions
- Use PascalCase for content type classes
- Use camelCase for field names
- Use descriptive names for both

### Validation
- Always specify required fields
- Add appropriate validations for fields
- Use specific link content type validations for references

### Organization
- Keep one content type per file
- Group related content types in directories
- Use index files to export multiple content types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

https://github.com/Moga-Digital-LLC/contentful-orm

## License

MIT
