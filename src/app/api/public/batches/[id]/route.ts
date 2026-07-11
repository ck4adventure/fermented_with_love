import { NextResponse } from 'next/server';
import { getPublicBatch } from '@/lib/ownership';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const batch = await getPublicBatch(id);

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(batch);
}
