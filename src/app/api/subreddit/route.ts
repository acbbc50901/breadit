import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      }
    })
    if (subredditExists) {
      return new NextResponse('已經有這個社群了', {status: 409})
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id
      }
    })

    return NextResponse.json(subreddit)
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('建立失敗', {status: 500})
  }
}