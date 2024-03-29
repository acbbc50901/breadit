'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostVaildator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  subredditId: string
}

const Editor: React.FC<Props> = ({subredditId}) => {

  const {
    register, handleSubmit, formState: {errors},
  } = useForm<PostCreationRequest>({resolver: zodResolver(PostVaildator), defaultValues: {
    subredditId,
    title: '',
    content: null,
  } })
  const pathname = usePathname();
  const router = useRouter()
  const ref = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, [])
  const initalizeEditor = useCallback(async () => {
    const EditorJs = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: '在這編寫文章',
        inlineToolbar: true,
        data: { blocks: []},
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link'
            }
          },
          image: {
            class: ImageTool,
            config : {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader')
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          InlineCode: InlineCode,
          table: Table,
          embed: Embed,
        }
      })
    }
  }, [])
  useEffect(() => {
    const init = async () => {
      await initalizeEditor();
      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0)
    }
    if (isMounted) {
      init()
      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initalizeEditor])
  useEffect(() => {
    if (Object.keys(errors).length) {
      for(const [_key, value] of Object.entries(errors)) {
        toast({
          title: '有些錯誤',
          description: (value as { message: string}).message,
          variant: 'destructive',
        })
      }
    }
  }, [errors])

  const {mutate: createPost} = useMutation({
    mutationFn: async ({title, content, subredditId}: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        subredditId, title, content
      }
      const {data} = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: '有錯誤',
        description: '你的文章沒有成功上傳，請檢查一下再次嘗試',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname);
      
      router.refresh();
      return toast({
        description: '成功上傳!'
      })
    }
  })

  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save()

    const payload : PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload);
  }

  const { ref: titleRef, ...rest} = register('title');
  return (
    <div className=' w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
      <form id='subreddit-post-form' className='w-full' onSubmit={handleSubmit(onSubmit)} >
        <div className=' prose prose-stone dark:prose-invert'>
          <TextareaAutosize ref={(e) => {
            titleRef(e)
            // @ts-ignore
            _titleRef.current = e
          }} {...rest} placeholder='標題' className=' w-full resize-none appearance-none overflow-hidden
            bg-transparent text-xl font-bold focus:outline-none'/>
          <div id='editor' className=' min-h-[500px]'/>
        </div>
      </form>
    </div>
  )
}

export default Editor