import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {  
  // Return just the children; no sidebar, no header, etc.
  return <>{children}</>;
} 