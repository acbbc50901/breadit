import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserNameValidator } from "@/lib/validators/username";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    
    if ( !session?.user) {
      return new NextResponse('尚未登入', {status: 401})
    }
    const body = await req.json()
    const { name } = UserNameValidator.parse(body);

    const userName = await db.user.findFirst({
      where: {
        username: name
      }
    })
    if (userName) {
      return new NextResponse('此名稱已被使用', {status: 409})
    }
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      }
    })
    return NextResponse.json('成功')
  } catch(error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 422})
    }
    return NextResponse.json('更新失敗', {status: 500})
  }
}