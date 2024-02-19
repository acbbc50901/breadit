import { z } from 'zod'

export const CommentVaildator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
})

export type CommentCreationRequest = z.infer<typeof CommentVaildator>