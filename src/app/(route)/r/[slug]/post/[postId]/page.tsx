import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { CachedPayload } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import PostVoteSverver from '@/components/postvote/PostVoteSverver'
import { formatTimeToNow } from '@/lib/utils'
import EditorOutput from '@/components/EditorOutput'
import CommentsSection from '@/components/CommentsSection'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const PostPage = async ({params} : {params: {postId: string}}) => {
  // const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPayload
  let post: (Post & {votes: Vote[]; author: User}) | null = await db.post.findFirst({
        where: {
          id: params.postId,
        },
        include: {
          votes: true,
          author: true,
        }
      }) || null
  
  // if (!cachedPost) {
  //   post = await db.post.findFirst({
  //     where: {
  //       id: params.postId,
  //     },
  //     include: {
  //       votes: true,
  //       author: true,
  //     }
  //   })
  // }
  if (!post) return console.log('錯誤ㄋ');
  const getData = async () => {
    return await db.post.findUnique({
      where: {
        id: params.postId
      },
      include: {
        votes: true
      }
    })
  }
  return (
    <div>
      <div className=' flex w-full flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteShell/>}>
          {/* @ts-expect-error server component */}
          <PostVoteSverver postId={post?.id} getData={getData}/>
        </Suspense>
        <div className=' sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
          <p className=' max-h-40 mt-1 truncate text-xs text-gray-500'>
            發布人 u/{post?.author.username }{' '}
            {formatTimeToNow(new Date(post?.createdAt))}
          </p>
          <h1 className=' text-xl font-semibold py-2 leading-6 text-gray-900'>
            {post?.title}
          </h1>
          <EditorOutput content={post?.content }/>
          <Suspense fallback={<Loader2 className=' h-3 w-3 animate-spin text-zinc-500'/>}>
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post?.id}/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return <div className=' flex items-center flex-col pr-6 w-20'>
    <div className={buttonVariants({ variant: 'ghost'})}>
      <ArrowBigUp className=' h-5 w-5 text-zinc-700'/>
    </div>
    <div className=' text-center py-2 font-medium text-sm text-zinc-900'>
      <Loader2 className=' h-3 w-3 animate-spin'/>
    </div>
    <div className={buttonVariants({ variant: 'ghost'})}>
      <ArrowBigDown className=' h-5 w-5 text-zinc-700'/>
    </div>
  </div>
}

// const PostPage = async({params} : {params: {postId: string}}) => {
//   const post = await db.post.findFirst({
//     where: {
//       id: params.postId,
//     },
//     include: {
//       votes: true,
//       author: true,
//     }
//   })

//   return (
//     <div>{post?.authorId}</div>
//   )
// }

export default PostPage