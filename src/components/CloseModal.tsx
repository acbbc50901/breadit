'use client'

import React from 'react'
import { Button } from './ui/Button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      variant='subtle' className=' h-6 w-6 p-0 rounded-md'
      aria-label='close modal' onClick={() => router.back()}><X/></Button>
  )
}

export default CloseModal