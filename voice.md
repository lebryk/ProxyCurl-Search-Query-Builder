# Implementing OpenAI WebRTC Realtime Audio with CopilotKit

This guide provides step-by-step instructions for implementing real-time audio capabilities using OpenAI's WebRTC API in a CopilotKit project.

## Prerequisites

1. An existing Next.js project with CopilotKit installed
2. OpenAI API key with access to Realtime API
3. Basic understanding of WebRTC concepts

## Step 1: Environment Setup

1. Add required environment variables to `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=your_copilot_key
```

2. Install necessary dependencies:
```bash
npm install webrtc @types/webrtc
```

## Step 2: Create Backend Endpoint

Create an API endpoint to generate ephemeral tokens (`app/api/realtime-session/route.ts`):

```typescript
import { OpenAI } from "openai";

export async function GET(): Promise<Response> {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse",
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

## Step 3: Implement WebRTC Service

Create a service to manage WebRTC connections (`app/services/realtimeAudio.ts`):

```typescript
import { RTCPeerConnection } from 'webrtc';

class RealtimeAudioService {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaStream: MediaStream | null = null;
  private initialized = false;
  private onTranscription: ((text: string) => void) | null = null;

  isInitialized(): boolean {
    return this.initialized;
  }

  async getAudioUrl(text: string): Promise<string> {
    await this.speak(text);
    // Return a blob URL that will stream the audio
    return URL.createObjectURL(await this.getAudioStream());
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    await this.startRecording();
    // Handle the transcription through WebRTC
    // Return the transcribed text
    return new Promise((resolve) => {
      this.onTranscription = resolve;
    });
  }

  async initialize() {
    // Implementation details in the source code
  }

  async startRecording(): Promise<void> {
    // Implementation details in the source code
  }

  async stopRecording(): Promise<void> {
    // Implementation details in the source code
  }

  async speak(text: string): Promise<void> {
    // Implementation details in the source code
  }

  cleanup() {
    // Implementation details in the source code
  }
}

export const globalRealtimeAudio = new RealtimeAudioService();
```

## Step 4: Integrate with CopilotKit

Since CopilotKit expects string URLs for its audio endpoints, we'll need to create wrapper endpoints that handle the WebRTC integration:

1. Create WebRTC wrapper endpoints:

```typescript
// app/api/webrtc-tts/route.ts
export async function POST(req: Request): Promise<Response> {
  const { text } = await req.json();
  
  // Initialize WebRTC if not already initialized
  if (!globalRealtimeAudio.isInitialized()) {
    await globalRealtimeAudio.initialize();
  }
  
  // Send text through WebRTC and get audio URL
  const audioUrl = await globalRealtimeAudio.getAudioUrl(text);
  
  return new Response(audioUrl);
}

// app/api/webrtc-stt/route.ts
export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const audioBlob = formData.get('file') as Blob;
  
  if (!globalRealtimeAudio.isInitialized()) {
    await globalRealtimeAudio.initialize();
  }
  
  const text = await globalRealtimeAudio.transcribe(audioBlob);
  
  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

2. Update your main CopilotKit component:

```typescript
import { useEffect } from 'react';
import { globalRealtimeAudio } from "./services/realtimeAudio";

export default function YourMainComponent() {
  useEffect(() => {
    // Initialize WebRTC service
    globalRealtimeAudio.initialize().catch(console.error);
    
    return () => {
      globalRealtimeAudio.cleanup();
    };
  }, []);

  return (
    <CopilotKit
      publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}
      transcribeAudioUrl="/api/webrtc-stt"
      textToSpeechUrl="/api/webrtc-tts"
    >
      {/* Your app content */}
    </CopilotKit>
  );
}
```

## Step 5: Error Handling and Fallbacks

1. Add error boundaries around WebRTC functionality
2. Implement fallback to regular REST API endpoints if WebRTC fails
3. Add reconnection logic for lost connections

```typescript
// Example error handling in realtimeAudio.ts
async initialize() {
  try {
    // Existing initialization code
  } catch (error) {
    console.error('WebRTC initialization failed:', error);
    // Fallback to REST API
    return this.initializeFallback();
  }
}
```

## Step 6: Testing

1. Test WebRTC Connection:
   - Check browser compatibility
   - Verify microphone permissions
   - Test with different network conditions

2. Test Audio Quality:
   - Verify speech-to-text accuracy
   - Check text-to-speech latency
   - Test concurrent audio streams

3. Test Error Scenarios:
   - Network disconnections
   - Permission denials
   - API failures

## Best Practices

1. **Security**:
   - Never expose OpenAI API keys in client code
   - Use ephemeral tokens with short expiration
   - Implement proper session management

2. **Performance**:
   - Initialize WebRTC connection early
   - Clean up resources when not in use
   - Handle audio streams efficiently

3. **User Experience**:
   - Provide clear feedback for connection status
   - Handle permissions requests gracefully
   - Implement smooth fallbacks

## Common Issues and Solutions

1. **WebRTC Connection Failures**
   - Check network connectivity
   - Verify STUN/TURN server configuration
   - Ensure proper SSL setup

2. **Audio Quality Issues**
   - Adjust audio constraints
   - Implement noise cancellation
   - Handle echo cancellation

3. **Browser Compatibility**
   - Test across different browsers
   - Implement feature detection
   - Provide fallback options

## Resources

- [OpenAI WebRTC Documentation](https://platform.openai.com/docs/guides/realtime)
- [WebRTC.org](https://webrtc.org/)
- [CopilotKit Documentation](https://docs.copilotkit.ai)

## Maintenance

1. **Regular Updates**:
   - Keep dependencies updated
   - Monitor OpenAI API changes
   - Update WebRTC implementations

2. **Monitoring**:
   - Track connection success rates
   - Monitor audio quality metrics
   - Log error patterns

3. **Performance Optimization**:
   - Optimize connection handling
   - Improve audio processing
   - Reduce latency

Remember to adapt this implementation to your specific use case and requirements. The WebRTC API is still in beta, so stay updated with OpenAI's documentation for any changes or improvements.
