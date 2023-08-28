'use client'
import { useMutation } from '@tanstack/react-query'
import { Button } from './ui/Button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import useCustomToast from '@/hooks/use-custom-toast'
import { startTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  subredditId: string,
  subredditName: string,
  isSubscribed: boolean,
}

const SubscribeLeaveToggle: React.FC<Props> = ({subredditId, subredditName, isSubscribed}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const paylod: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      }
      const { data } = await axios.post('/api/subreddit/subscribe', paylod)
      return data.subredditId
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: '已追蹤',
            description: '已經追蹤過了',
            variant: 'destructive',
          })
        }
        if (error.response?.status === 401) {
          return loginToast()
        }

        toast({
          title: '發生錯誤!!',
          description: '不太知道是甚麼問題 聯絡管理人',
          variant: 'destructive',
        })
      }
    },
    onSuccess:() => {
      startTransition(() => {
        router.refresh();
      })
      toast({
        title: '成功追蹤',
        description: `成功追蹤了!!! ${subredditName}`,
      })
    } 
  })
  const { mutate: Unsubscribe, isLoading:  isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const paylod: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      }
      const { data } = await axios.post('/api/subreddit/unsubscribe', paylod)
      return data.subredditId
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: '尚未追蹤',
            description: '不能取消追蹤',
            variant: 'destructive',
          })
        }
        if (error.response?.status === 400) {
          return toast({
            title: '刪除失敗',
            description: '你不能刪除你自己的追蹤 這樣你會沒朋友QQ',
            variant: 'destructive',
          })
        }
        if (error.response?.status === 401) {
          return loginToast()
        }

        toast({
          title: '發生錯誤!!',
          description: '不太知道是甚麼問題 聯絡管理人',
          variant: 'destructive',
        })
      }
    },
    onSuccess:() => {
      startTransition(() => {
        router.refresh();
      })
      toast({
        title: '成功取消追蹤',
        description: `成功取消追蹤了!!! ${subredditName}`,
      })
    } 
  })
  return isSubscribed ?
    (<Button onClick={() => Unsubscribe()} isLoading={isUnSubLoading} disabled={isUnSubLoading} className='w-full mt-1 mb-4'>取消追蹤</Button>)
    : (<Button onClick={() => subscribe()} isLoading={isSubLoading} disabled={isSubLoading} className='w-full mt-1 mb-4'>追蹤</Button>)
}

export default SubscribeLeaveToggle