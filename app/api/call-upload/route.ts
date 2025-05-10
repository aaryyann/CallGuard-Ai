import { NextRequest , NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Call from "@/model/call";

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface ICloudinaryUploadResult {
    public_id : string ;
    bytes : number,
    duration : number
    [key : string] : any
}
export async function POST (request : NextRequest){
    try{

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        const patientName = formData.get("patientName") as string
        const doctorName = formData.get("doctorName") as string
        const callDate = new Date(formData.get("callDate") as string);
        const transcript = formData.get("transcript") as string;
        const keywordsFlagged = JSON.parse(formData.get("keywordsFlagged") as string); 
        const riskLevel = formData.get("riskLevel") as "Low" | "Medium" | "High" | "None";
        const statusValue = formData.get("statusValue") as "New" | "Reviewed" | "Resolved"


        if(!file){
            return NextResponse.json({
                message : "File not found"
            } , {status : 400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<ICloudinaryUploadResult>((resolve , reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder : "calls-upload"},
                (error , result) => {
                    if(error){
                        reject(error)
                    }
                    else {
                        resolve(result as unknown as ICloudinaryUploadResult)
                    }
                }
            )
            uploadStream.end(buffer)
        })

        const audio = await Call.create({
            patientName ,
            doctorName , 
            callDate ,
            duration : result.duration,
            audioUrl : result.public_id,
            transcript ,
            keywordsFlagged ,
            riskLevel ,
            statusValue

        })

        return NextResponse.json(audio)

    }
    catch(e){
        console.log("Upload image failed")
        return NextResponse.json({
            error : "Upload Image failed"
        },{
            status : 500
        })
    }
}