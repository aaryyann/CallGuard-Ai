import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(req : NextRequest){
    const token = await getToken({req , secret : process.env.NEXTAUTH_SECRET})

    if(!token && req.nextUrl.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL('/login' , req.url))
    }

    return NextResponse.next()
}