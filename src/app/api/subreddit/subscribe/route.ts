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
    if (subredditExists) {
      return new NextResponse('你已經追蹤了', {status: 409})
    }

    const subreddit = await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id
      }
    })


    return NextResponse.json(subreddit)
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('追蹤失敗', {status: 500})
  }
}