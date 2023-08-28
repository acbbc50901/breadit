'use client'

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { Icons } from './Icon'
import { useToast } from '@/hooks/use-toast'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm : React.FC<Props> = ({className, ...props}) => {

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const loginGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: '登入錯誤!!',
        description: 'Google登入出了問題可能是帳號密碼有出錯',
        variant: 'destructive',
      })
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const loginGithub = async () => {
    setIsLoading(true);
    try {
      await signIn('github')
    } catch (error) {
      toast({
        title: '登入錯誤!!',
        description: 'Github登入出了問題可能是帳號密碼有出錯',
        variant: 'destructive',
      })
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex justify-center flex-col gap-2', className)} {...props}>
      <Button size='sm' className=' w-full' onClick={loginGoogle} disabled={isLoading} isLoading={isLoading}>
        { isLoading ? null : <Icons.google className='h-4 w-4 mr-2  '/> }
        Google
      </Button>
      <Button size='sm' className=' w-full' onClick={loginGithub} disabled={isLoading} isLoading={isLoading}>
        { isLoading ? null : <Icons.github className='h-4 w-4 mr-2 fill-white '/> }
        Github
      </Button>
    </div>
  )
}

export default UserAuthForm