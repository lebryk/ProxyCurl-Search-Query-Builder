import '@/App/globals.css'
import { Geist } from "next/font/google"
import { ReactNode } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function SurveyLayout({ children }: { children: ReactNode }) {  
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} min-h-screen font-sans antialiased`}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 