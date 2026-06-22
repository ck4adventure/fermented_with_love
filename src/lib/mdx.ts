import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  description: string;
  section: string;
  slug: string;
  order: number;
  tags: string[];
  lastUpdated: string;
}

export interface PostData extends PostMetadata {
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export function getAllSections(): string[] {
  return fs.readdirSync(contentDirectory).filter((item) => {
    return fs.statSync(path.join(contentDirectory, item)).isDirectory();
  });
}

export function getPostsBySection(section: string): PostMetadata[] {
  const sectionPath = path.join(contentDirectory, section);
  
  if (!fs.existsSync(sectionPath)) {
    return [];
  }

  const files = fs.readdirSync(sectionPath).filter((file) => file.endsWith('.mdx'));

  const posts = files
    .map((file) => {
      const filePath = path.join(sectionPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      return data as PostMetadata;
    })
    .sort((a, b) => a.order - b.order);

  return posts;
}

export function getAllPosts(): PostMetadata[] {
  const sections = getAllSections();
  const allPosts: PostMetadata[] = [];

  sections.forEach((section) => {
    const posts = getPostsBySection(section);
    allPosts.push(...posts);
  });

  return allPosts.sort((a, b) => a.order - b.order);
}

export function getPostBySlug(section: string, slug: string): PostData | null {
  const sectionPath = path.join(contentDirectory, section);
  
  if (!fs.existsSync(sectionPath)) {
    return null;
  }

  const files = fs.readdirSync(sectionPath).filter((file) => file.endsWith('.mdx'));
  const matchedFile = files.find((file) => {
    const filePath = path.join(sectionPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return (data as PostMetadata).slug === slug;
  });

  if (!matchedFile) {
    return null;
  }

  const filePath = path.join(sectionPath, matchedFile);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    ...(data as PostMetadata),
    content,
  };
}

export function getSectionDisplayName(section: string): string {
  const names: { [key: string]: string } = {
    'getting-started': 'Getting Started',
    'working-with-fruit': 'Working with Fruit',
    fermentation: 'Fermentation',
  };

  return names[section] || section;
}
