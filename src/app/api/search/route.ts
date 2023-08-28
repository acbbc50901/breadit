import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');

  if(!q) return new NextResponse('並沒有傳入任何尋找參數', {status: 400})

  const res = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q,
      }
    },
    include: {
      _count: true,
    },
    take: 5,
  })
  return NextResponse.json(res);
}