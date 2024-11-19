#!/usr/bin/env node
import { Command } from 'commander';
import { sync } from './sync.js';

const program = new Command();

program
  .name('contentful-orm')
  .description('CLI for Contentful ORM')
  .version('0.1.2');

program
  .command('sync')
  .description('Sync content types to Contentful')
  .requiredOption('--path <pattern>', 'Glob pattern to find content type files')
  .action(async (options) => {
    try {
      await sync(options.path);
      console.log('Sync completed successfully!');
    } catch (error) {
      console.error('Error during sync:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
