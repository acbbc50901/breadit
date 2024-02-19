import { User } from 'next-auth';
import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from 'next/image';
import { Icons } from './Icon';
import { AvatarProps } from '@radix-ui/react-avatar';

interface Props extends AvatarProps {
  user: Pick<User, 'name'|  'image'>
}
const UserAvatar: React.FC<Props> = ({user, ...props}) => {
  return (
    <Avatar {...props}>
      {
        user.image ? (<div className=' relative aspect-square h-full w-full'>
          <Image src={user.image} alt={user.name || ''} fill referrerPolicy='no-referrer'/>
        </div>) : (
        <AvatarFallback>
          <span className=' sr-only'> {user.name} </span>
          <Icons.user className='h-4 w-4'/>
        </AvatarFallback>)
      }
    </Avatar>
  )
}

export default UserAvatar