# 📞 CallGuard AI — Medical Risk Detection from Patient Calls

CallGuard AI is an AI-powered web application that transcribes patient–nurse phone calls and automatically flags potential adverse medical risks using a curated medical symptom database (based on FAERS). It enables healthcare providers to detect high-risk symptoms early and take timely action to prevent emergencies.

## 🚀 Live Demo
[🔗 Your Deployment Link Here](https://your-live-link.com)

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
│   ├── dashboard/              # Main dashboard UI
│   ├── upload/                 # Upload call form/modal
│   └── calls/
│       └── [id]/               # Call details page (View button)
├── lib/
│   └── mongodb.ts              # MongoDB connection logic
├── models/
│   └── call.ts                 # Mongoose schema for call entries
├── pages/                      # (if using pages dir)
│   └── api/
│       └── calls/              # POST and GET calls
│       └── upload/             # Audio upload + transcription handler
├── public/                     # Public assets (optional)
├── styles/                     # Global styles or Tailwind config
├── utils/
│   ├── riskKeywords.ts         # List of 1000+ FAERS symptom terms
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

1. **Transcript Extraction**  
   Calls are transcribed using **Deepgram's neural speech recognition** engine.

2. **Keyword Matching**  
   The transcript is scanned against 1000+ medically significant symptom keywords from the FAERS dataset.

3. **Risk Scoring**  
   - `5+ matches` → 🔴 High Risk  
   - `3–4 matches` → 🟡 Medium Risk  
   - `1–2 matches` → 🟢 Low Risk  
   - `0` → ✅ No risk detected

4. **Flagged Terms**  
   Matched terms are stored and displayed alongside the transcript.

## 📥 Installation & Local Setup

```bash
git clone https://github.com/yourusername/callguard-ai.git
cd callguard-ai

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
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_CLOUD_NAME=xxx
MONGODB_URI=your-mongo-uri
```

## 📹 Demo Video

📺 [Watch Demo on YouTube](https://youtu.be/your-demo-link)

## 👨‍💻 Made By

Ashray R — Solo Developer  
Open to collaboration, internship opportunities, and feedback!  
[GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

## 📜 License

MIT License. Open-source for educational and non-commercial use.