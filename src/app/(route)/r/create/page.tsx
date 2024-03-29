'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useMutation } from '@tanstack/react-query'
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from 'axios'
import { toast } from "@/hooks/use-toast";
import useCustomToast from "@/hooks/use-custom-toast";

const RPageView = () => {
  const [input, setInput] = useState<string>('');
  const router = useRouter()
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading} = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      }
      const { data } = await axios.post('/api/subreddit', payload)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: '已經有這個社群了',
            description: '請重新創立一個名稱沒有重複的社群',
            variant: 'destructive',
          })
        }
        if (error.response?.status === 422) {
          return toast({
            title: '名稱請在3到21個字元',
            description: '字太少或者太多了',
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
    onSuccess: (res) => {
      toast({
        title: '創立成功',
        description: '恭喜你創立成功!!',
      })
      router.push(`/r/${res.name}`)
    }
  });

  return (
    <div className=" container flex items-center h-full max-w-3xl mx-auto">
      <div className=" relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className=" flex justify-between items-center">
          <h1 className=" text-xl font-semibold"> 新增社群 </h1>
        </div>
        <hr className=" bg-zinc-500 h-px"/>
        <div className="">
          <p className=" text-lg font-medium">名稱:</p>
          <p className=" text-xs pb-2"> 團體名稱無法被改變 </p>
        </div>
        <div className=" relative">
          <p className=" absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-500">r/</p>
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6"/>
        </div>
        <div className=" flex justify-end gap-4">
          <Button variant='subtle' onClick={() => router.back()}>取消</Button>
          <Button isLoading={isLoading} disabled={input.length === 0 || isLoading} onClick={() => createCommunity()}> 建立社群 </Button>
        </div>
      </div>
    </div>
  )
}

export default RPageView