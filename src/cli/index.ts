#!/usr/bin/env node

import 'ts-node/register';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { glob } from 'glob';
import { ContentfulSync } from '../sync';

const CONTENT_TYPE_METADATA_KEY = 'contentful:content-type';

dotenv.config();

const program = new Command();

program
  .name('contentful-orm')
  .description('CLI tool for Contentful ORM')
  .version('0.1.0');

program
  .command('sync')
  .description('Sync content types with Contentful')
  .option('-p, --path <path>', 'Path to content type files', 'src/entities/**/*.ts')
  .option('-e, --environment <env>', 'Contentful environment', 'master')
  .option('-d, --debug', 'Enable debug logging')
  .action(async (options) => {
    const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
      console.error('Missing required environment variables:');
      if (!CONTENTFUL_SPACE_ID) console.error('- CONTENTFUL_SPACE_ID');
      if (!CONTENTFUL_ACCESS_TOKEN) console.error('- CONTENTFUL_ACCESS_TOKEN');
      process.exit(1);
    }

    try {
      const sync = new ContentfulSync(CONTENTFUL_ACCESS_TOKEN);
      const files = glob.sync(options.path);
      console.log('Found files:', files);

      for (const file of files) {
        console.log(`Processing file: ${file}`);
        try {
          const module = await import(process.cwd() + '/' + file);
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
              await sync.syncContentType(entity, CONTENTFUL_SPACE_ID, options.environment);
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
    } catch (error) {
      console.error('Error during sync:', error);
      process.exit(1);
    }
  });

program.parse();
