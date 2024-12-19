import { MessageSquare } from "lucide-react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatSectionProps {
  messages: Message[];
  onSubmit: (message: string) => void;
}

export const ChatSection = ({ messages, onSubmit }: ChatSectionProps) => {
  return (
    <div className="border-none h-full flex flex-col min-h-0">
      <div className="shrink-0 px-3 py-2 bg-gray-50 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm">Current Chat</span>
      </div>
      <div className="flex-1 min-h-0">
        <div className="h-full bg-gray-50 rounded-lg p-3 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
          <div className="shrink-0">
            <ChatInput onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};