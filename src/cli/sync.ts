import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
import { ContentfulSync } from '../sync/index.js';
import { getContentTypeMetadata } from '../decorators/index.js';

dotenv.config();

export async function sync(pattern: string): Promise<void> {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_ENVIRONMENT_ID = 'master' } = process.env;

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error('Missing required environment variables:');
    if (!CONTENTFUL_SPACE_ID) console.error('- CONTENTFUL_SPACE_ID');
    if (!CONTENTFUL_ACCESS_TOKEN) console.error('- CONTENTFUL_ACCESS_TOKEN');
    process.exit(1);
  }

  const sync = new ContentfulSync(CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID);
  const files = glob.sync(pattern);
  console.log('Found files:', files);

  for (const file of files) {
    console.log(`Processing file: ${file}`);
    try {
      const filePath = join(process.cwd(), file);
      const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
      const module = await import(fileUrl);

      // Get all exported values from the module
      const exportedValues = Object.values(module);
      
      // Find all class constructors with ContentType decorator
      const entities = exportedValues.filter((value): value is Function => {
        if (typeof value !== 'function' || !value.prototype) {
          return false;
        }
        
        const metadata = getContentTypeMetadata(value);
        if (!metadata) {
          console.log(`No metadata found for ${value.name} in ${file}`);
          return false;
        }

        console.log(`Found content type: ${metadata.name} in ${file}`);
        return true;
      });

      if (entities.length === 0) {
        console.log(`No content type entities found in ${file}`);
        continue;
      }

      // Process each entity
      for (const entity of entities) {
        try {
          await sync.syncContentType(entity);
        } catch (error) {
          console.error(`Error syncing content type from ${file}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
      throw error;
    }
  }

  console.log('Sync completed successfully!');
}
