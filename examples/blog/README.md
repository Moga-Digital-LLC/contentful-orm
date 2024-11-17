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

## Usage

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

3. Sync content types with Contentful:
```bash
npm run sync
```

## Features Demonstrated

- Different field types (Text, RichText, Date, Boolean, etc.)
- Field validations (size, pattern, etc.)
- Reference fields (single and array)
- Self-referential content types
- Localization
- Required fields
- Array fields with various item types
- Media fields with mime type validation
