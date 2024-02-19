'use client'

import React, { useRef, useState } from 'react'
import UserAvatar from './UserAvatar';
import { CommentVote, User, Comment } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { CommentCreationRequest } from '@/lib/validators/comment';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '@/hooks/use-custom-toast';

type ExtendedComment = Comment & {
  votes: CommentVote[],
  author: User,
}

interface Props {
  comment: ExtendedComment,
  votesAmt: number,
  currentVote: CommentVote | undefined,
  postId: string,
}
const PostComment = ({comment, votesAmt, currentVote, postId} : Props) => {
  const [input, setInput] = useState('');
  const { loginToast } = useCustomToast();
  const { mutate: postcomment, isLoading } = useMutation({
    mutationFn: async ({postId, text, replyToId} : CommentCreationRequest) => {
      const payload: CommentCreationRequest = {
        postId,
        text,
        replyToId,
      }
      const { data } = await axios.post(`/api/subreddit/post/comment`, payload)
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
      toast({
        title: '發生錯誤!!',
        description: '不太知道是甚麼問題 聯絡管理人',
        variant: 'destructive',
      })
    },onSuccess: () => {
      router.refresh();
      setInput('');
      setIsReplying(false);
    }
  })
  const commentRef = useRef<HTMLDivElement> (null);
  const router = useRouter();
  const { data : session} = useSession();
  const [isReplying, setIsReplying] = useState(false);
  return (
    <div className=' flex flex-col' ref={commentRef}>
      <div className=' flex items-center'>
        <UserAvatar user={{
          name: comment.author.name || null,
          image: comment.author.image || null,
        }} className=' w-6 h-6'/>
        <div className=' ml-2 flex items-center gap-x-2'>
          <p className=' text-sm font-medium text-gray-900'>
            u/{comment.author.username}
          </p>
          <p className=' max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className=' text-sm text-zinc-900 mt-2'>{comment.text}</p>
      <div className=' flex gap-2 items-start flex-col'>
        <div className=' flex gap-2 items-start'>
          <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote}/>
          <Button onClick={() => {
            if (!session) return router.push('/sign-in')
            setIsReplying(true)
          }} variant='ghost' size='xs'>
            <MessageSquare className=' h-4 w-4 mr-1.5'/>
            回覆
          </Button>
        </div>
        {
          isReplying ? (
            <div className=' grid w-full gap-1.5'>
              <Label>你的回覆</Label>
              <div className=' mt-2'>
                <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1}
                  placeholder='留下你的評論'/>
                <div className=' mt-2 flex justify-end gap-2'>
                  <Button tabIndex={-1} variant='subtle' onClick={() => setIsReplying(false)}>刪除</Button>
                  <Button isLoading={isLoading} disabled={isLoading || input.length === 0}
                    onClick={() => {
                      if (!input) return
                      postcomment({postId, text:input, replyToId: comment.replyToId ?? comment.id})}
                    }>發布</Button>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default PostComment