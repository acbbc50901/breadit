import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from './PostFeed'
import { getAuthSession } from '@/lib/auth'

const CustomFeed = async () => {

  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    }
  })

  const post = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((item) => item.subredditId)
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  })
  return (
    <>
      <PostFeed initialPosts={post}/>
    </>
  )
}

export default CustomFeed