# 📞 CallGuard AI — Medical Risk Detection from Patient Calls

CallGuard AI is an AI-powered web application that transcribes patient–nurse phone calls and automatically flags potential adverse medical risks using a curated medical symptom database (based on FAERS). It enables healthcare providers to detect high-risk symptoms early and take timely action to prevent emergencies.

## 🚀 Live Demo
[🔗 Your Deployment Link Here](https://call-guard-ai.dvxaryan.xyz)
[🔗 Figma Design Link](https://www.figma.com/design/bZ88OmsQQZs0u4HLrDnusO/CallGuard_AI?node-id=0-1&m=dev&t=Oxjz0r3DuVDSqeFl-1)
[🔗 Documentation Link](https://1drv.ms/w/s!AsiH8QL1wE6zr3d6ZjcG7xOHjv8C?e=zI4qXT)

## 🎯 Use Case
This project is built for the Veersa Hackathon — Use Case 1: **Adverse Event Detection from Patient Calls**. The goal is to predict possible medical emergencies by analyzing recorded conversations between patients and nurses or medical agents.

## 🧠 Features

- 🎙 Upload audio call recordings (MP3, WAV, etc.)
- 🧠 AI transcription using **Deepgram Speech-to-Text API**
- ⚠️ Risk analysis using 1000+ symptoms from the **FAERS** database
- 🟢🟡🔴 Auto-classification into **Low, Medium, High** risk levels
- ☁️ Cloudinary-based audio hosting + duration extraction
- 🧾 Full call transcript with **highlighted risk keywords**
- 📊 Dashboard to manage & review calls
- 🎧 Audio playback inside the app

## 🛠 Tech Stack

| Area           | Tool/Library                |
|----------------|-----------------------------|
| Frontend       | Next.js, TypeScript, Tailwind CSS |
| Audio Upload   | Cloudinary                  |
| Transcription  | **Deepgram Speech API**     |
| Risk Detection | Rule-based NLP using FAERS terms |
| Backend        | Next.js API Routes, Mongoose |
| Database       | MongoDB Atlas               |

## 📦 Project Structure

```
callguard-ai/
├── app/
│   ├── api/
│        ├── auth/              # POST and GET calls
│               ├── signup/
|               └── login/
│        └── call-upload/       # Audio upload + transcription handler in Mongodb
│   ├── dashboard/              # Main dashboard UI
│         └── upload a call/    # upload a call section
│   ├── login/                  # User login
│   └── signup/                 # user signup
├── components/
|   └── ui/                     # shadcn ui componets
├── lib/
│   ├── utils.ts/               # utility section
│   └── mongodb.ts              # MongoDB connection logic
├── models/
│   └── call.ts                 # Mongoose schema for call entries
│   └── user.ts                 # Mongoose schema for user entries
|
├── public/                     # Public assets (optional)
├── styles/                     # Global styles or Tailwind config
├── utils/
│   ├── riskKeywords.ts         # List of 40+ FAERS symptom terms
│   └── analyzeTranscript.ts    # Function to calculate risk level & keywords
├── .env.local                  # Your environment variables
├── README.md                   # This file!
└── package.json
```

## 🧪 Sample Test Calls

| File                | Symptoms Mentioned                                | Risk Level |
|---------------------|---------------------------------------------------|------------|
| moderate_case.mp3   | nausea, dizziness, rash                           | 🟡 Medium  |
| high_risk_case.mp3  | chest pain, shortness of breath, swollen face...  | 🔴 High    |
| safe_case.mp3       | no symptoms detected                              | 🟢 Low     |

> All test cases were created using real speech recordings and evaluated by the engine.

## 📊 How Risk Prediction Works

1. **🎙️ Transcript Extraction**  
   Audio calls are transcribed using **Deepgram's neural speech recognition**.

2. **🧠 AI Analysis (Google Gemini)**  
   The transcript is sent to **Google Gemini**, which performs:
   - Symptom extraction
   - Condition prediction
   - Risk level assessment (`High`, `Medium`, `Low`, `None`)
   - Confidence scoring (0–100)
   - Red flag detection
   - Medical advice generation

3. **🩺 Flagged Keywords**  
   Detected medical terms are stored and shown alongside the transcript.

4. **📈 Risk Visualization**  
   Each call is color-coded by risk level and shows the AI's full interpretation in the dashboard.

## 📥 Installation & Local Setup

```bash
git clone https://github.com/aaryyann/CallGuard_AI.git
cd CallGuard_AI

# Install dependencies
npm install

# Add your .env variables
cp .env.example .env.local

# Run dev server
npm run dev
```

## 📂 Environment Variables Required

```env
DEEPGRAM_API_KEY=your-deepgram-api-key
GOOGLE_API_KEY=your-google-ai-api-key
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NEXT_PUBLIC_CLOUDINARY_NAME=your-cloudinary-name
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

## 📹 Demo Video

📺  Demo Video: [Click to watch](./demo/callguard-presentation.mp4)

## 👨‍💻 Made By

Aryan Gupta (Team Lead)
Ashray Bhardwaj
Anshika Mishra
Anshika Shinghal
Open to collaboration, internship opportunities, and feedback!  
[GitHub](https://github.com/aaryyann) 

## 📜 License

MIT License. Open-source for educational and non-commercial use.