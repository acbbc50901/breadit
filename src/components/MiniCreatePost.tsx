'use client'

import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import UserAvatar from './UserAvatar'
import { Input } from './ui/input'
import { Button } from './ui/Button'
import { ImageIcon, Link2 } from 'lucide-react'

interface Props {
  session: Session | null
}

const MiniCreatePost: React.FC<Props> = ({session}) => {

  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className=' !m-0 list-none overflow-hidden rounded-md bg-white shadow'>
      <div className=' h-full py-2 px-4 sm:px-6 sm:py-4 gap-2 sm:gap-6 flex sm:justify-between flex-wrap sm:flex-nowrap'>
        <div className=' relative'>
          <UserAvatar user={{
            name: session?.user.name || null,
            image: session?.user.image || null, 
          }} />
          <span className=' absolute bottom-0 right-0 rounded-full w-3
          h-3 bg-green-500 outline outline-2 outline-white'/>
        </div>
        <Input readOnly onClick={() => router.push(pathname+ '/submit')}
            placeholder='建立文章'/>
        <Button variant='ghost'  onClick={() => router.push(pathname+ '/submit')}>
            <ImageIcon className=' text-zinc-600'/>
          </Button>
        <Button variant='ghost'  onClick={() => router.push(pathname+ '/submit')}>
            <Link2 className=' text-zinc-600'/>
          </Button>
      </div>
    </li>
  )
}

export default MiniCreatePost