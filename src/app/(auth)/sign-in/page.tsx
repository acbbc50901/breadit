import SignIn from '@/components/SignIn'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'


const SignInpage: React.FC  = () => {
  return (
    <div className=' absolute inset-0'>
      <div className=' h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <Link href='/' className={cn(buttonVariants({variant:'ghost'}), 'self-start -my-20')}>首頁</Link>
        <SignIn />
      </div>
    </div>
  )
}

export default SignInpage