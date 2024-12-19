import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fadeIn",
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md",
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground ml-4 animate-slideLeft'
            : 'bg-white border border-gray-100 mr-4 animate-slideRight'
        )}
      >
        <p className="text-[15px] leading-relaxed font-light">{message.text}</p>
        <p 
          className={cn(
            "text-[11px] mt-1.5 font-normal",
            message.sender === 'user' 
              ? 'text-primary-foreground/60' 
              : 'text-muted-foreground/60'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};