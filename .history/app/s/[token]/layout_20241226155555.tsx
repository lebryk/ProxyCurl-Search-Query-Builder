import { ReactNode } from 'react';

export default function SurveyLayout({ children }: { children: ReactNode }) {  
  // Return just the children; no sidebar, no header, etc.
  return <>{children}</>;
} 

SurveyLayout.displayName = 'SurveyLayout'; 