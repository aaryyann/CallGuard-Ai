import { NextResponse } from "next/server";
import { connectionWithDB } from "@/lib/mongodb";
import Call from "@/model/call";

export default async function POST(request : Request){

    const {patient , doctor , callDate , duration , transcript , keywordsFlagged , riskLevel , status } = await request.json()
}