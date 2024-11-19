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
2. Use ES modules syntax with `.js` extensions in your import statements
3. Export all entities from an `index.ts` file

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

// src/entities/index.ts
export * from './author.js';  // Note the .js extension
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

## Examples

Check out the [examples](./examples) directory for complete working examples:
- Blog example with authors, posts, and categories
- Content type examples showcasing different field types and configurations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

https://github.com/Moga-Digital-LLC/contentful-orm

## License

MIT
