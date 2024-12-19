'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { SidebarProvider } from '@/components/ui/sidebar';

const SIDEBAR_STATE_KEY = "sidebar-state";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setDefaultOpen(savedState === "true");
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(open));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
        <ProjectProvider>
          {children}
        </ProjectProvider>
     </SidebarProvider>
    </QueryClientProvider>
  );
}
