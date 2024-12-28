import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Survey - Nominait",
  description: "Complete your survey",
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Nominait Logo" className="h-8" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
