import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google"
import Providers from './providers'
import { AppSidebar } from "@/components/features/AppSidebar";
import { TanStackDevTools } from '@/components/TanStackDevTools';

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

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} h-screen flex flex-col font-sans antialiased`}>
      <Providers>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 flex-shrink-0">
            <AppSidebar />
          </aside>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <TanStackDevTools />
      </Providers>
    </div>
  )
}
