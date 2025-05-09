export const dynamic = "force-dynamic";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import User from "@/model/user"
import { connectionWithDB } from "@/lib/mongodb"



export async function POST(request : Request){
    const {name , email , password , organization , agreeToTerms} = await request.json()
    const isValidMail = (email : string) => {

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
        return regex.test(email)
    }

    if(!name || !email || !password || !organization || agreeToTerms == false){
        return NextResponse.json({
            message : "Fill all fields"
        },
        {status : 400})
    }

    if(!isValidMail(email)){
        return NextResponse.json({
            message : "Invalid Email"
        },{
            status : 400
        })
    }

    try{
        await connectionWithDB()
        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json({
                message : "User already exist"
            },{
                status : 400
            })
        }

        const hashPassword = await bcrypt.hash(password , 5)
        
        await User.create({
            name : name ,
            email : email,
            organization : organization,
            password : hashPassword,
            agreeToTerms : agreeToTerms
        })

        return NextResponse.json({
            message : 'User created'
        },{
            status : 201
        })
    }catch(e){
        return NextResponse.json({
            message : "Something went wrong"
        })
    }
}