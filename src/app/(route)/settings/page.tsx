export const metadata ={
  title: '設定',
  description: '設定你的資訊',
}

import UserNameForm from '@/components/UserNameForm';
import { authOptions, getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const SettingPage = async () => {

  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions.pages?.signIn || 'sign-in')
  }

  return (
    <div className=' max-w-4xl mx-auto py-12'>
      <div className=' grid items-start gap-8'>
        <h1 className=' font-bold text-3xl md:text-4xl'>設定</h1>
      </div>
      <div className=' grid gap-10'>
        <UserNameForm user={{
          username: session.user.username || '',
          id: session.user.id,
        }}/>
      </div>
    </div>
  )
}

export default SettingPage