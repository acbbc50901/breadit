import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CachedPayload } from '@/types/redis'
import { NextResponse } from "next/server";
import { z } from "zod";
import { redis } from "@/lib/redis";
import { CommentVaildator } from "@/lib/validators/comment";

const CACHE_AFTER_UPVOTES = 1

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId} = CommentVaildator.parse(body);
    
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    })

    return new NextResponse('ok')
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('發布失敗，請在試一次', {status: 500})
  }
}