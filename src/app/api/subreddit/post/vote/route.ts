import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CachedPayload } from '@/types/redis'
import { PostVoteValidator } from "@/lib/validators/vote";
import { NextResponse } from "next/server";
import { z } from "zod";
import { redis } from "@/lib/redis";

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      }
    })
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      }
    })
    if (!post) {
      return new NextResponse('找不到文章',{status: 404})
    }
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id
            }
          }
        })
        return NextResponse.json('ok')
      }
      await db.vote.update({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId
          }
        },
        data: {
          type: voteType,
        }
      })

      const votesAmt = post.votes.reduce((acc,vote) => {
        if(vote.type === 'UP') return acc + 1
        if(vote.type === 'DOWN') return acc -1
        return acc
      }, 0)
      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachPayload : CachedPayload = {
          authorUsername: post.author.username ?? '',
          content: JSON.stringify(post.content),
          title: post.title,
          id: post.id,
          currentVote: voteType,
          createdAt: post.createdAt,
        }

      await redis.hset(`post: ${postId}`, cachPayload)
      }
      return NextResponse.json('完成')
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      }
    })
    const votesAmt = post.votes.reduce((acc,vote) => {
      if(vote.type === 'UP') return acc + 1
      if(vote.type === 'DOWN') return acc -1
      return acc
    }, 0)
    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachPayload : CachedPayload = {
        authorUsername: post.author.username ?? '',
        content: JSON.stringify(post.content),
        title: post.title,
        id: post.id,
        currentVote: voteType,
        createdAt: post.createdAt,
      }

    await redis.hset(`post: ${postId}`, cachPayload)
    }

    return NextResponse.json('完成')
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('發布失敗，請在試一次', {status: 500})
  }
}