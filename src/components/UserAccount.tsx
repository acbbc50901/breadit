'use client'
import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface Props {
  user: Pick<User, 'name'| 'email' | 'image'>
}

const UserAccount: React.FC<Props> = ({user}) => {
  const SignOut = (event: any) => {
    event.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}/sign-in`
    })
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className=' w-8 h-8' user={user}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=' bg-white' align='end'>
        <div className=' flex items-center justify-start gap-2 p-2'>
          <div className=' flex flex-col space-y-1 leading-none'>
            {user.name && <p className=' font-medium'> {user.name} </p>}
            {user.email && <p className=' w-[200px] truncate text-sm text-zinc-700'> {user.email} </p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/'>首頁</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/r/create'>建立文章</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings'>設定</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(event) => SignOut(event)} className=' cursor-pointer'>
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccount