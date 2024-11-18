# Contentful ORM

A TypeScript-first ORM for Contentful CMS that enables a code-first approach to content modeling. Define your content types using TypeScript decorators and automatically sync them with Contentful.

> **Note**: This guide represents the current implementation approach until version 1.0 is released. The API and setup process may change in future releases.

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
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master  # or your preferred environment
```

#### 2. TypeScript Configuration

Create a dedicated `tsconfig.contentful.json` for model compilation:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "strict": true,
    "useDefineForClassFields": false,
    "outDir": "./dist/models",
    "rootDir": "./src"
  },
  "include": ["src/models/**/*.ts"]
}
```

#### 3. Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "compile-models": "tsc --project tsconfig.contentful.json",
    "sync": "pnpm compile-models && cross-env TS_NODE_PROJECT=./tsconfig.contentful.json ts-node ./node_modules/contentful-orm/dist/cli/index.js sync --path=\"dist/models/**/*.js\""
  }
}
```

### Creating Models

Create your models in `src/models/` using TypeScript decorators:

```typescript
import 'reflect-metadata';
import { ContentType, Field } from 'contentful-orm';

@ContentType('teamMember')
export class TeamMember {
  @Field({
    type: 'Symbol',
    required: true,
    validations: [{ size: { min: 2, max: 100 } }]
  })
  name: string;

  @Field({
    type: 'RichText',
    required: true,
    validations: [{
      enabledNodeTypes: [
        'paragraph',
        'heading-1',
        'heading-2',
        'unordered-list',
        'ordered-list'
      ],
      enabledMarks: ['bold', 'italic', 'underline']
    }]
  })
  bio: string;

  @Field({
    type: 'Link',
    linkType: 'Asset',
    validations: [{ linkMimetypeGroup: ['image'] }]
  })
  image?: string;
}
```

### Available Field Types

- `Symbol`: For short text (< 256 characters)
- `Text`: For longer text
- `RichText`: For formatted text with markdown
- `Integer`: For whole numbers
- `Number`: For decimal numbers
- `Date`: For dates and times
- `Boolean`: For true/false values
- `Link`: For references to assets or other entries
- `Array`: For lists of items
- `Object`: For JSON objects

### Field Decorator Options

```typescript
interface FieldOptions {
  type: string;
  required?: boolean;
  localized?: boolean;
  linkType?: 'Asset' | 'Entry';
  validations?: any[];
  items?: {
    type: string;
    validations?: any[];
    linkType?: string;
  };
}
```

### Syncing with Contentful

1. Compile your models:
```bash
pnpm run compile-models
```

2. Sync with Contentful:
```bash
pnpm run sync
```

### Validation Rules

Common validation options:

```typescript
// Size validation
validations: [{ size: { min: 2, max: 100 } }]

// Unique values
validations: [{ unique: true }]

// Rich text configuration
validations: [{
  enabledNodeTypes: ['paragraph', 'heading-1'],
  enabledMarks: ['bold', 'italic']
}]

// Asset type validation
validations: [{ linkMimetypeGroup: ['image'] }]

// Array item validation
items: {
  type: 'Symbol',
  validations: [{ size: { min: 2, max: 50 } }]
}
```

### Troubleshooting

1. **Decorator Errors**
   - Ensure `experimentalDecorators` and `emitDecoratorMetadata` are enabled in your TypeScript config
   - Import `reflect-metadata` at the top of your model files

2. **Module Resolution Issues**
   - Use `moduleResolution: "bundler"` for ESM projects
   - Ensure your project's `type` in `package.json` matches your module system

3. **Sync Failures**
   - Check your environment variables are correctly set
   - Verify your Contentful access token has management API permissions
   - Ensure your models are properly compiled before syncing

### Best Practices

1. **Model Organization**
   - Keep models in a dedicated `src/models` directory
   - One model per file
   - Use clear, descriptive names for models and fields

2. **Field Validation**
   - Always add appropriate validations
   - Set reasonable size limits for text fields
   - Configure rich text fields with only necessary features

3. **Type Safety**
   - Use TypeScript's strict mode
   - Define proper types for all fields
   - Utilize interfaces for complex field types

### Limitations

- Contentful-orm currently works best with Node.js LTS versions
- Some advanced Contentful features may require manual configuration
- Changes to content types may require migration in production environments

## Examples

Check out the [examples](./examples) directory for complete working examples:
- Blog example with authors, posts, and categories
- Content type examples showcasing different field types and configurations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

https://github.com/Moga-Digital-LLC/contentful-orm

## License

MIT
