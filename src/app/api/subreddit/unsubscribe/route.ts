import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subredditExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id
      }
    })
    if (!subredditExists) {
      return new NextResponse('尚未追蹤', {status: 409})
    }
    
    // check
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id
      }
    })

    if (subreddit) {
      return new NextResponse('你不能刪除你自己的追蹤 這樣你會沒朋友QQ', {status: 400})
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id
        }
      }
    })


    return NextResponse.json('成功')
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('取消追蹤失敗', {status: 500})
  }
}