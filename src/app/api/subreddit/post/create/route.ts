import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostVaildator } from "@/lib/validators/post";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json();
    const { subredditId, title, content } = PostVaildator.parse(body);

    const subredditExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id
      }
    })
    if (!subredditExists) {
      return new NextResponse('需要追蹤才能發文!', {status: 409})
    }

    const subreddit = await db.post.create({
      data: {
        subredditId,
        content,
        title,
        authorId: session.user.id,
      }
    })


    return NextResponse.json(subreddit)
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('發布失敗，請在試一次', {status: 500})
  }
}