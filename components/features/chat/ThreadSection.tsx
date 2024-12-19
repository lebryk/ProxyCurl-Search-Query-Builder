import { History, ChevronDown } from "lucide-react";
import { Thread } from "@/types/chat";
import { ChatThreadList } from "./ChatThreadList";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ThreadSectionProps {
  threads: Thread[];
  activeThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onThreadUpdate: (threads: Thread[]) => void;
}

export const ThreadSection = ({
  threads,
  activeThreadId,
  onThreadSelect,
  onThreadUpdate,
}: ThreadSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-none shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span className="text-sm">Chat History</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "" : "-rotate-90"
          )} 
        />
      </button>
      <div className={cn(
        "py-2 transition-all duration-200",
        isOpen ? "block" : "hidden"
      )}>
        <ChatThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          onThreadSelect={onThreadSelect}
          onThreadUpdate={onThreadUpdate}
        />
      </div>
    </div>
  );
};