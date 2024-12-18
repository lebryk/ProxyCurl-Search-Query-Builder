# Implementing Voice Functionality with OpenAI and CopilotKit

This guide explains how to implement voice capabilities (Text-to-Speech and Speech-to-Text) in your application using OpenAI's services and CopilotKit.

## Prerequisites

- OpenAI API Key
- Next.js application

## Setup

### 1. Install Dependencies

```bash
npm install @copilotkit/react-core @copilotkit/react-ui openai
```

### 2. Configure Environment Variables

Create or update your `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Implementation

### 1. Configure CopilotKit

In your root component (e.g., `app/page.tsx`), set up CopilotKit with voice capabilities:

```typescript
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function App() {
  return (
    <CopilotKit
      transcribeAudioUrl="/api/transcribe"
      textToSpeechUrl="/api/tts"
    >
      <YourAppComponent />
    </CopilotKit>
  );
}
```

### 2. Implement Text-to-Speech API

Create `app/api/tts/route.ts`:

```typescript
import { OpenAI } from "openai";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  const openai = new OpenAI();
  const url = new URL(req.url);
  const text = url.searchParams.get("text");

  if (!text) {
    return new Response("Text parameter is missing", { status: 400 });
  }

  const response = await openai.audio.speech.create({
    voice: "alloy",
    input: text,
    model: "tts-1",
  });

  return response;
}
```

### 3. Implement Speech-to-Text API

Create `app/api/transcribe/route.ts`:

```typescript
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("File not provided", { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    return new Response(JSON.stringify(transcription), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

### 4. Create Audio Utilities

Create `utils/globalAudio.tsx`:

```typescript
"use client";

export let globalAudio: any = undefined;

export function resetGlobalAudio() {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.currentTime = 0;
  } else {
    globalAudio = new Audio();
  }
}

export async function speak(text: string) {
  const encodedText = encodeURIComponent(text);
  const url = `/api/tts?text=${encodedText}`;
  globalAudio.src = url;
  globalAudio.play();
  await new Promise<void>((resolve) => {
    globalAudio.onended = function () {
      resolve();
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
}
```

### 5. Create Voice UI Components

Example of a speak button component:

```typescript
import { useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { resetGlobalAudio, speak } from "@/app/utils/globalAudio";

export function SpeakButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <button
      disabled={isSpeaking}
      onClick={async () => {
        resetGlobalAudio();
        try {
          setIsSpeaking(true);
          await speak(text);
        } finally {
          setIsSpeaking(false);
        }
      }}
    >
      <SpeakerWaveIcon className={`h-5 w-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
    </button>
  );
}
```

## Usage

1. **Text-to-Speech**:
   - Use the `speak` function to convert text to speech:
   ```typescript
   await speak("Hello, this is a test message");
   ```

2. **Speech-to-Text**:
   - CopilotKit handles speech-to-text automatically through its UI components
   - The transcribed text will be available in your Copilot's context

## Best Practices

1. **Error Handling**:
   - Always implement proper error handling for API calls
   - Provide user feedback during voice operations

2. **Audio State Management**:
   - Use the `resetGlobalAudio` function before starting new audio
   - Track speaking state to prevent overlapping audio

3. **User Experience**:
   - Show loading states during voice operations
   - Provide visual feedback when audio is playing
   - Allow users to stop audio playback

4. **Performance**:
   - Use edge runtime for API routes when possible
   - Implement proper cleanup for audio resources

## Limitations

- OpenAI's Whisper model supports multiple languages but works best with English
- TTS has a character limit per request
- Audio playback requires user interaction on some browsers
- Real-time transcription may have slight delays

## Security Considerations

1. Always validate input on the server side
2. Use environment variables for API keys
3. Implement rate limiting for API endpoints
4. Handle file size limits for audio uploads

## Resources

- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
