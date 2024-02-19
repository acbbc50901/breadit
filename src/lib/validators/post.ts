import { z } from 'zod'

export const PostVaildator = z.object({
  title: z.string().min(3,{message: '標題不可少於三個字'}).max(128,{message: '不可大於128個字ToLong~'}),
  subredditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostVaildator>