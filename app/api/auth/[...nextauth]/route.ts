import NextAuth from "next-auth";
import User from "@/model/user";
import { connectionWithDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider  from "next-auth/providers/credentials";

const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers :[
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : {},
                password : {}
            },
            async authorize(credentials){
                try{
                    await connectionWithDB()
                    const user = await User.findOne({email : credentials?.email})

                    if(!user){
                        throw new Error("")
                    }

                    const isValidPassword = await bcrypt.compare(credentials?.password ?? "" , user.password as string)

                    if(!isValidPassword){
                        throw new Error("")
                    }
                }
            }
        })
    ]
})