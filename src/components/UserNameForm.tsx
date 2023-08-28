'use client'

import { UserNameValidator, UsernameRequest } from "@/lib/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/Button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Props {
  user:Pick<User, 'id' | 'username'>
}
const UserNameForm: React.FC<Props> = ({user}) => {
  const {
    handleSubmit, register, formState: {errors},
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UserNameValidator),
    defaultValues: {
      name: user.username || ''
    }
  })
  const router = useRouter();
  const {mutate: onSubmit, isLoading} = useMutation({
    mutationFn: async ({name} : UsernameRequest) => {
      const payload : UsernameRequest = {name};
      const {data} = await axios.patch(`/api/username`, payload);
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: '這名稱已經被取走了',
            description: '不能取已經取過的名稱',
            variant: 'destructive',
          })
        }
        toast({
          title: '發生錯誤!!',
          description: '不太知道是甚麼問題 聯絡管理人',
          variant: 'destructive',
        })
      }
    },
    onSuccess:() => {
      toast({
        title: '成功更改',
        description: `成功更改了!!!`,
      })
      router.refresh();
    } 
  })
  return (
    <form onSubmit={handleSubmit((e) => onSubmit(e))}>
      <Card>
        <CardHeader>
          <CardTitle>名稱</CardTitle>
          <CardDescription>這邊可以更改使用者名稱</CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" relative grid gap-1">
            <div className=" absolute top-0 left-0 w-8 h-10 flex place-items-center">
              <span className=" text-sm text-zinc-400">u/</span>
            </div>
            <Label className=" sr-only " htmlFor="name">名稱</Label>
            <Input id='name' className="max-w-[400px] min-w-[100px] w-full pl-6" size={32} {...register('name')}/>
            {
              errors.name && (
                <p className=" text-rose-600 px-1 text-xs">
                  {errors.name.message}
                </p>
              )
            }
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' isLoading={isLoading} disabled={isLoading}>更改名稱</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UserNameForm