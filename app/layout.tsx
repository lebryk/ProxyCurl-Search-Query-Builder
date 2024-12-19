import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google"
import '../styles/globals.css'
import { CopilotKit } from "@copilotkit/react-core"; 
import { CopilotSidebar } from "@copilotkit/react-ui"; 
import "@copilotkit/react-ui/styles.css"; 
import Providers from './providers'
import { AppSidebar } from "@/components/features/AppSidebar";

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
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased w-max`}>
        <Providers>
          <CopilotKit runtimeUrl="/api/copilotkit" agent="research_canvas" textToSpeechUrl="/api/tts" transcribeAudioUrl="/api/transcribe"> 
            <div className="flex h-screen overflow-hidden w-max">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto w-max">
                {children}
              </main>
            </div>
          </CopilotKit>
        </Providers>
      </body>
    </html>
  )
}
