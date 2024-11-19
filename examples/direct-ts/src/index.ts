import { BlogPost } from './post.ts';

async function main() {
  const post = new BlogPost();
  post.title = 'My First Blog Post';
  post.content = 'This is a test blog post using contentful-orm with TypeScript';
  post.publishDate = new Date();
  post.tags = ['test', 'typescript', 'contentful'];

  console.log('Created blog post:', post);
}

main().catch(console.error);
