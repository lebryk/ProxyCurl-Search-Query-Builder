import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Thread } from "@/types/chat";
import { loadThreads, saveThreads, createNewThread } from "@/utils/chatStorage";
import { ThreadSection } from "./chat/ThreadSection";
import { ChatSection } from "./chat/ChatSection";

export const SearchAIChat = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  useEffect(() => {
    const savedThreads = loadThreads();
    if (savedThreads.length > 0) {
      setThreads(savedThreads);
      setActiveThreadId(savedThreads[0].id);
    }
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleNewThread = () => {
    const newThread = createNewThread("New Chat");
    const updatedThreads = [newThread, ...threads];
    setThreads(updatedThreads);
    setActiveThreadId(newThread.id);
    saveThreads(updatedThreads);
  };

  const handleThreadUpdate = (updatedThreads: Thread[]) => {
    setThreads(updatedThreads);
    saveThreads(updatedThreads);
  };

  const handleNewMessage = (newMessage: string) => {
    if (!activeThreadId) return;

    const updatedThreads = threads.map(thread => {
      if (thread.id === activeThreadId) {
        const newMsg = {
          id: Date.now(),
          text: newMessage,
          sender: 'user' as const,
          timestamp: new Date()
        };
        return {
          ...thread,
          messages: [...thread.messages, newMsg],
          updatedAt: new Date()
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    saveThreads(updatedThreads);
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="shrink-0 p-2 border-b">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleNewThread}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <ThreadSection
          threads={threads}
          activeThreadId={activeThreadId}
          onThreadSelect={setActiveThreadId}
          onThreadUpdate={handleThreadUpdate}
        />
        <ChatSection
          messages={activeThread?.messages || []}
          onSubmit={handleNewMessage}
        />
      </div>
    </div>
  );
};