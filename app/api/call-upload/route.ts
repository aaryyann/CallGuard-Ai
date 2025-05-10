import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Call from "@/model/call";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface ICloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  duration: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const patientName = formData.get("patientName") as string;
    const doctorName = formData.get("doctorName") as string;
    const callDate = new Date(formData.get("callDate") as string);

    if (!file || !patientName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // temp file
    const tempPath = path.join("/tmp", `${uuidv4()}.mp3`);
    await writeFile(tempPath, new Uint8Array(buffer));

    // Transcribe Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
    });

    fs.unlinkSync(tempPath); 

    // Cloudinary Part
    const result = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "calls-upload", resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as unknown as ICloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    //  DB
    const audioData = await Call.create({
      patientName,
      doctorName,
      callDate,
      duration: result.duration,
      audioUrl: result.secure_url, 
      transcript: transcription.text ?? "",
    });

    return NextResponse.json(audioData, { status: 201 });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
