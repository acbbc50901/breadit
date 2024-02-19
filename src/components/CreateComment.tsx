'use client'

import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentCreationRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Props {
  postId: string,
  replyToId?: string
}

const CreateComment = ({postId, replyToId}: Props) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const [input, setInput] = useState('');
  const { mutate: comment, isLoading } = useMutation({
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
    }
  })

  return (
    <div className=' grid w-full gap-1.5'>
      <Label htmlFor='評論'>你的評論</Label>
      <div className=' mt-2'>
        <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1}
          placeholder='留下你的評論'/>
        <div className=' mt-2 flex justify-end'>
          <Button isLoading={isLoading} disabled={isLoading} onClick={() => comment({postId, text:input, replyToId})}>發布</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment