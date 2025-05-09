import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL


if(!MONGODB_URL){
    throw new Error ("Mongo db not established")
}

export const connectionWithDB = async() => {

    console.log("Called")

    try {
        await mongoose.connect(MONGODB_URL)
        console.log('DB connected')
    }catch(e){
        console.log(e)
        console.log("DB connection failed")
    }
}