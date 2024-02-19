'use client'
import Link from "next/link"
import { Icons } from "@/components/Icon"
import UserAuthForm from "@/components/UserAuthForm"

const SignUp = () => {
  return (
    <div className=" container sm:px-0 px-4 mx-auto w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className=" flex flex-col space-y-2 text-center">
        <Icons.logo className=" mx-auto h-6 w-6"/>
        <h1 className=" text-2xl font-semibold tracking-tight">註冊</h1>
        <p className=" text-sm max-w-md mx-auto">繼續即表示您正要註冊</p>
        {/* { sign in form} */}
        <UserAuthForm className=""/>
        <p className=" px-8 text-center text-sm text-zinc-700">
          已經有帳號了嗎?? {' '} 
          <span>
            <Link href='/sign-in' className=" hover:text-zinc-800 text-sm underline underline-offset-4">
              登入
            </Link>
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp