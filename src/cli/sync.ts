import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
import { ContentfulSync } from '../sync/index.js';

const CONTENT_TYPE_METADATA_KEY = 'contentful:content-type';

dotenv.config();

export async function sync(pattern: string): Promise<void> {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error('Missing required environment variables:');
    if (!CONTENTFUL_SPACE_ID) console.error('- CONTENTFUL_SPACE_ID');
    if (!CONTENTFUL_ACCESS_TOKEN) console.error('- CONTENTFUL_ACCESS_TOKEN');
    process.exit(1);
  }

  const sync = new ContentfulSync(CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID);
  const files = glob.sync(pattern);
  console.log('Found files:', files);

  for (const file of files) {
    console.log(`Processing file: ${file}`);
    try {
      const filePath = join(process.cwd(), file);
      const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
      const module = await import(fileUrl);
      const entities = Object.values(module).filter(value => 
        typeof value === 'function' && 
        Reflect.getMetadata(CONTENT_TYPE_METADATA_KEY, value)
      ) as Function[];
      
      if (entities.length === 0) {
        console.log(`No content type entities found in ${file}`);
        continue;
      }

      console.log(`Found ${entities.length} entities in ${file}`);
      for (const entity of entities) {
        try {
          await sync.syncContentType(entity);
        } catch (error) {
          console.error(`Error syncing entity from ${file}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      throw error;
    }
  }
  console.log('Sync completed successfully!');
}
