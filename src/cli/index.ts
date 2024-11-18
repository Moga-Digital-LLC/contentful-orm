#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Command } from 'commander';
import { sync } from './sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('contentful-orm')
  .description('CLI for Contentful ORM')
  .version('0.1.2');

program
  .command('sync')
  .description('Sync content types to Contentful')
  .requiredOption('--path <path>', 'Path to entity files (glob pattern)')
  .action(async (options) => {
    try {
      await sync(options.path);
    } catch (error) {
      console.error('Error during sync:', error);
      process.exit(1);
    }
  });

program.parse();
