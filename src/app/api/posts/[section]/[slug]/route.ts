import { getPostBySlug } from '@/lib/mdx';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string; slug: string }> }
) {
  const { section, slug } = await params;
  const post = getPostBySlug(section, slug);

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}
