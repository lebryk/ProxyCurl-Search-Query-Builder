'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, createContext, useContext } from 'react';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css"; 


const SIDEBAR_STATE_KEY = "sidebar-state";
const CHAT_STATE_KEY = "chat-state";

interface ChatContextType {
  isChatOpen: boolean;
}

export const ChatContext = createContext<ChatContextType>({ isChatOpen: true });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setDefaultOpen(savedState === "true");
    }
  }, []);

  useEffect(() => {
    const savedChatState = localStorage.getItem(CHAT_STATE_KEY);
    if (savedChatState !== null) {
      setIsChatOpen(savedChatState === "true");
    } else {
      // Set initial state in localStorage if it doesn't exist
      localStorage.setItem(CHAT_STATE_KEY, String(true));
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(open));
  };
  
  const handleChatToggle = (open: boolean) => {
    setIsChatOpen(open);
    localStorage.setItem(CHAT_STATE_KEY, String(open));
    console.log("Chat state:", open);
  };

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="agent" textToSpeechUrl="/api/tts" transcribeAudioUrl="/api/transcribe">
      <ChatContext.Provider value={{ isChatOpen }}>
        <CopilotSidebar
          defaultOpen={true}
          clickOutsideToClose={false}
          onSetOpen={handleChatToggle}
          labels={{
            title: "Query Builder",
            initial: "Hi! 👋 I'm here to help you create Search Queries",
          }}
        />
        <QueryClientProvider client={queryClient}>
          <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
            <ProjectProvider>
              {children}
            </ProjectProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </ChatContext.Provider>
    </CopilotKit>
  );
}
