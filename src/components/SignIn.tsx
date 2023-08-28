'use client'
import Link from "next/link"
import { Icons } from "./Icon"
import UserAuthForm from "./UserAuthForm"
import React, { useEffect } from "react"
import {useRouter, useSearchParams } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

const SignIn = () => {
  const pathname = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    if (pathname.get('error')) {
      toast({
        title: '登入錯誤!!',
        description: '登入出了問題可能是信箱已經有註冊過了',
        variant: 'destructive',
      })
    }
  },[pathname])
  return (
    <div className=" container sm:px-0 px-4 mx-auto w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className=" flex flex-col space-y-2 text-center">
        <Icons.logo className=" mx-auto h-6 w-6"/>
        <h1 className=" text-2xl font-semibold tracking-tight">歡迎回來</h1>
        <p className=" text-sm max-w-md mx-auto">繼續即表示您正在設置帳戶並同意我們的用戶協議隱私政策</p>
        {/* { sign in form} */}
        <UserAuthForm className=""/>
        <p className=" px-8 text-center text-sm text-zinc-700">
          新用戶? {' '} 
          <span>
            <Link href='/sign-up' className=" hover:text-zinc-800 text-sm underline underline-offset-4">
              註冊
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignIn