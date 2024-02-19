import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db';
import React from 'react'
import PostComment from './PostComment';
import CreateComment from './CreateComment';

interface Props {
  postId: string
}


const CommentsSection = async ({postId} : Props) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        }
      },
    }
  })
  return (
    <div className=' flex flex-col gap-y-4 mt-4'>
      <hr className=' w-full h-px my-6'/>
      <CreateComment postId={postId}/>
      <div className=' flex flex-col gap-y-6 my-4'>
        {
          comments.filter((item) => !item.replyToId).map((itpLeve, key) => {
            const topLevelCommentVotesAmt = itpLeve.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc -1
              return acc
            }, 0)
            const topLevelCommentVote = itpLeve.votes.find((vote) => vote.userId === session?.user.id)

            return <div key={key} className=' flex flex-col'>
              <div className='mb-2'>
                <PostComment postId={postId} votesAmt={topLevelCommentVotesAmt} currentVote={topLevelCommentVote} comment={itpLeve}/>
              </div>
              {/* { render replies} */}
              {
                itpLeve.replies.sort((a,b) => b.votes.length - a.votes.length).map
                  ((replay, key) => {
                    const replyVotesAmt = replay.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc -1
                      return acc
                    }, 0)
                    const replyVote = replay.votes.find((vote) => vote.userId === session?.user.id)
                    return <div key={key} className=' ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
                      <PostComment comment={replay} currentVote={replyVote} votesAmt={replyVotesAmt} postId={postId}/>
                    </div>
                  })
              }
            </div>
          })
        }
      </div>
    </div>
  )
}

export default CommentsSection