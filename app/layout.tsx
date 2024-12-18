import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google"
import '../styles/globals.css'
import { CopilotKit } from "@copilotkit/react-core"; 
import { CopilotSidebar } from "@copilotkit/react-ui"; 
import "@copilotkit/react-ui/styles.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Query Builder',
  description: 'Advanced query builder interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="research_canvas" textToSpeechUrl="/api/tts" transcribeAudioUrl="/api/transcribe"> 
          <CopilotSidebar
            defaultOpen={true}
            clickOutsideToClose={false}
            labels={{
              title: "Query Builder",
              initial: "Hi! 👋 I'm here to help you create Search Queries",
            }}
          >
            {children}
          </CopilotSidebar>
        </CopilotKit>
      </body>
    </html>
  )
}
