import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Call from "@/model/call";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { analyzeTranscript } from "@/utils/analyze-transcript";
import { connectionWithDB } from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import os from "os";
import { createClient } from "@deepgram/sdk";


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
  const tempPath = path.join(os.tmpdir(), `${uuidv4()}.mp3`);
  try {
    await connectionWithDB();

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub || token.email;

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

    await writeFile(tempPath, new Uint8Array(buffer));

    // Deepgram Transcription
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    const audioBuffer = fs.readFileSync(tempPath);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-3",
      smart_format: true,
      language: "en",
    });

    if (error) throw error;

    const transcriptText = result.results.channels[0].alternatives[0].transcript;
    const analysis = await analyzeTranscript(transcriptText);

    fs.unlinkSync(tempPath);

    // Cloudinary Upload
    const resultCloudinary = await new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "calls-upload", resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as unknown as ICloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    const audioData = await Call.create({
      patientName,
      doctorName,
      callDate,
      duration: resultCloudinary.duration,
      audioUrl: resultCloudinary.secure_url,
      transcript: transcriptText,
      keywordsFlagged: analysis.keywordsFlagged,
      riskLevel: analysis.riskLevel,
      confidenceScore: analysis.confidenceScore,        
      condition: analysis.condition,                    
      advice: analysis.advice,                       
      redFlags: analysis.redFlags,
      userId: userId,
    });

    return NextResponse.json(audioData, { status: 201 });
  } catch (e) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectionWithDB();
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub || token.email;
    const calls = await Call.find({ userId }).sort({ callDate: -1 });
    if (!calls) {
      return NextResponse.json(
        { message: "No calls found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: calls }, { status: 200 });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
