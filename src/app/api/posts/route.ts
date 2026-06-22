import { getAllPosts } from '@/lib/mdx';
import { NextResponse } from 'next/server';

export function GET() {
  const posts = getAllPosts();
  return NextResponse.json(posts);
}
