import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      }
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id
            }
          }
        })
        return NextResponse.json('ok')
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            }
          },
          data: {
            type: voteType,
          }
        })
      }

      
      return NextResponse.json('完成')
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      }
    })


    return NextResponse.json('完成')
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('發布失敗，請在試一次', {status: 500})
  }
}