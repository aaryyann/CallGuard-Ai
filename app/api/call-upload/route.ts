// Importing necessary modules and libraries
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

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Interface for Cloudinary upload result
interface ICloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  duration: number;
  [key: string]: any;
}

// POST handler for uploading and processing audio files
export async function POST(request: NextRequest) {
  const tempPath = path.join(os.tmpdir(), `${uuidv4()}.mp3`); // Temporary file path for storing uploaded audio
  try {
    await connectionWithDB(); // Establishing database connection

    // Verifying user authentication using NextAuth
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub || token.email; // Extracting user ID from token

    // Parsing form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const patientName = formData.get("patientName") as string;
    const doctorName = formData.get("doctorName") as string;
    const callDate = new Date(formData.get("callDate") as string);

    // Validating required fields
    if (!file || !patientName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Converting file to buffer and saving it temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempPath, new Uint8Array(buffer));

    // Transcribing audio using Deepgram API
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    const audioBuffer = fs.readFileSync(tempPath);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-3",
      smart_format: true,
      language: "en",
    });

    if (error) throw error;

    // Extracting transcript and analyzing it
    const transcriptText = result.results.channels[0].alternatives[0].transcript;
    const analysis = await analyzeTranscript(transcriptText);

    // Deleting the temporary file after transcription
    fs.unlinkSync(tempPath);

    // Uploading audio to Cloudinary
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

    // Saving call data to the database
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

    // Returning the saved data as a response
    return NextResponse.json(audioData, { status: 201 });
  } catch (e) {
    // Cleaning up temporary file in case of an error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// GET handler for fetching call data
export async function GET(req: NextRequest) {
  try {
    await connectionWithDB(); // Establishing database connection

    // Verifying user authentication using NextAuth
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub || token.email; // Extracting user ID from token

    // Fetching call data for the authenticated user
    const calls = await Call.find({ userId }).sort({ callDate: -1 });
    if (!calls) {
      return NextResponse.json(
        { message: "No calls found" },
        { status: 404 }
      );
    }

    // Returning the fetched data as a response
    return NextResponse.json({ success: true, data: calls }, { status: 200 });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
