# Blog Example

This example demonstrates how to use the Contentful ORM library to create a blog content model with authors, categories, and blog posts.

## Content Types

### Author
- Name (required)
- Email
- Bio (rich text)
- Avatar (image)
- Social Links (array of references)

### Category
- Name (required)
- Description
- Slug (required, URL-friendly)
- Parent Category (self-reference)

### Blog Post
- Title (required, localized)
- Slug (required, URL-friendly)
- Content (rich text, required, localized)
- Excerpt (localized)
- Featured Image
- Author (reference, required)
- Categories (references, 1-5 required)
- Publish Date (required)
- Featured Flag (boolean)
- Tags (array of strings)
- Related Posts (references to other blog posts)

## Requirements

### Environment
- Node.js 16 or higher
- TypeScript 5.2 or higher
- Contentful Management API access

### Contentful Setup
- A Contentful space with management access
- Management API token with content model management permissions
- Optional: A specific environment (defaults to 'master')

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Contentful credentials:
```env
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-management-token
CONTENTFUL_ENVIRONMENT=master # optional
```

3. Build the TypeScript files:
```bash
npm run build
```

4. Sync content types with Contentful:
```bash
# Sync compiled JavaScript files (after build)
npm run sync

# Or sync TypeScript files directly (using ts-node)
npm run sync_ts
```

## Troubleshooting

### Common Issues

1. **Decorator Metadata Error**
   ```
   Property 'getMetadata' does not exist on type 'typeof Reflect'
   ```
   Solution: Ensure you have `reflect-metadata` imported at the entry point of your application.

2. **Module Resolution Error**
   ```
   Cannot find module '...' or its corresponding type declarations
   ```
   Solution: Check that your `tsconfig.json` has the correct module and moduleResolution settings.

3. **Contentful API Error**
   ```
   No content type metadata found for [Entity]
   ```
   Solution: Verify that your entity class is properly decorated with `@ContentType` and exported.

4. **File Path Issues**
   ```
   No entity files found matching pattern
   ```
   Solution: Check that your sync command is using the correct file path pattern relative to the project root.

### Best Practices

1. **Content Type Names**
   - Use camelCase for content type IDs
   - Make names descriptive but concise
   - Avoid special characters

2. **Field Configuration**
   - Always specify `required` status explicitly
   - Add appropriate validations
   - Use descriptive field names
   - Consider localization needs upfront

3. **References**
   - Specify linkContentType validations
   - Consider bidirectional references
   - Plan the content hierarchy

4. **Project Structure**
   - Keep entities in a dedicated directory
   - Use index.ts to export all entities
   - Maintain one entity per file
   - Group related entities together

## Features Demonstrated

- Different field types (Text, RichText, Date, Boolean, etc.)
- Field validations (size, pattern, etc.)
- Reference fields (single and array)
- Self-referential content types
- Localization
- Required fields
- Array fields with various item types
- Media fields with mime type validation

## Scripts

- `npm run build`: Compile TypeScript files
- `npm run sync`: Sync compiled JS files with Contentful
- `npm run sync_ts`: Sync TypeScript files directly with Contentful
