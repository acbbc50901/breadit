'use client'
import { CommentVote, VoteType } from '@prisma/client'
import React, { useState } from 'react'
import useCustomToast from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { Button } from './ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { CommentVoteRequest  } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

interface Props {
  commentId: string,
  initialVotesAmt: number,
  initialVote?: Pick<CommentVote, 'type'>
}

const CommentVotes: React.FC<Props> = ({
  commentId, initialVotesAmt, initialVote
}) => {

  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const {mutate: vote, isLoading} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload : CommentVoteRequest = {
        commentId,
        voteType,
      }
      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((res) => res - 1)
      if (voteType === 'DOWN') setVotesAmt((res) => res + 1)

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: '錯誤',
        description: '出現問題',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if(currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((res) => res - 1)
        else if (type === 'DOWN') setVotesAmt((res) => res + 1)
      } else {
        setCurrentVote({type})
        if (type === 'UP') setVotesAmt((res) => res + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmt((res) => res - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className=' flex gap-1'>
      <Button onClick={() => isLoading? null : vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', {
          'text-emerald-500 fill-emerald-500' : currentVote?.type === 'UP',
        })}/>
      </Button>
      <p className=' text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>
      <Button onClick={() => isLoading? null : vote('DOWN')} size='sm' variant='ghost' aria-label='downvote'>
        <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', {
          'text-rose-500 fill-rose-500' : currentVote?.type === 'DOWN',
        })}/>
      </Button>
    </div>
  )
}

export default CommentVotes