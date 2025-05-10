import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Call from "@/model/call";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";
import OpenAi from "openai"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface ICloudinaryUploadResult {
    public_id: string;
    bytes: number,
    duration: number
    [key: string]: any
}

export async function POST(request: NextRequest) {
    try {

        const openai = new OpenAi()
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        const patientName = formData.get("patientName") as string
        const doctorName = formData.get("doctorName") as string
        const callDate = new Date(formData.get("callDate") as string);


        if (!file) {
            return NextResponse.json({
                message: "File not found"
            }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)


        const tempPath = path.join("/tmp", `${uuidv4()}.mp3`)
        await writeFile(tempPath, new Uint8Array(buffer))

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempPath),
            model: "whisper-1",
        })

        fs.unlinkSync(tempPath);
        


        const result = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "calls-upload", resource_type: "video" },
                (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    else {
                        resolve(result as unknown as ICloudinaryUploadResult)
                    }
                }
            )
            uploadStream.end(buffer)
        })


        const audioData = await Call.create({
            patientName,
            doctorName,
            callDate,
            duration: result.duration,
            audioUrl: result.public_id,
            transcript : transcription.text ?? "",
            keywordsFlagged,
            riskLevel,
            statusValue

        })

        return NextResponse.json(audioData)

    }
    catch (e) {
        console.log("Upload image failed")
        return NextResponse.json({
            error: "Upload Image failed"
        }, {
            status: 500
        })
    }
}