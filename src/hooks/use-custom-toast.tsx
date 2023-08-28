import React from 'react'
import { toast } from './use-toast'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

const useCustomToast = () => {
  const loginToast = () => {
    const {dismiss} = toast({
      title: '請登入',
      description: '你需要登入才能進行下一步',
      variant: 'destructive',
      action: (
        <Link href='/sign-in' onClick={() => dismiss() }
          className={buttonVariants({variant: 'outline'})}>
          登入
        </Link>
      )
    })
  }
  return {loginToast}
}

export default useCustomToast