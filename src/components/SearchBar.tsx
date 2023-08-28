'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from './ui/command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

const SearchBar = () => {
  const [input, setInput] = useState('');

  
  const {data: quertResults, refetch, isFetched, isFetching } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const {data} = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType,
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })
  const request = debounce(() => {
    refetch()
  }, 300)
  const debounceReq = useCallback(async () => {
    request();
  },[])
  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(commandRef, () => {
    setInput('');
  })
  const pathname = usePathname();
  useEffect(() => {
    setInput('');
  }, [pathname])
  return (
    <Command ref={commandRef} className=' relative rounded-lg border max-w-lg z-50 overflow-visible'>
      <CommandInput value={input} onValueChange={(text) => {
        setInput(text)
        debounceReq()
      }}
      className=' outline-none border-none focus:border-none focus:outline-none ring-0'
      placeholder='找尋你想找的文章..'/>
      {
        input.length > 0 ? (
          <CommandList className=' absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
            {isFetched && <CommandEmpty>並無資料</CommandEmpty>}
            {(quertResults?.length ?? 0) > 0 ? (
              <CommandGroup heading='搜尋結果'>
                {quertResults?.map((item, key) => {
                  return (
                    <CommandItem key={key} onSelect={() => {
                      router.push(`/r/${item.name}`)
                      router.refresh();
                    }} value={item.name} className=' cursor-pointer'>
                      <Users className='mr-2 h-4 w-4'/>
                      <a href={`/r/${item.name}`}>{item.name}</a>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ): null}
          </CommandList>
        ) : null
      }
    </Command>
  )
}

export default SearchBar