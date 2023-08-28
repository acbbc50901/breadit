import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import React from 'react'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { notFound } from 'next/navigation';
import MiniCreatePost from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';

const SlugPage  = async ({params}: {params: {slug: string}}) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: {
      name:  decodeURIComponent(slug),
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        }, 
        orderBy: {
          createdAt: 'desc',
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
      },
    },
  })

  if (!subreddit) return notFound()
  return (
    <>
    <h1 className=' font-bold text-2xl md:text-4xl h-14'> r/{subreddit?.name}</h1>
    <MiniCreatePost session={session}/>
    <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name}/>
    </>

  )
}

export default SlugPage