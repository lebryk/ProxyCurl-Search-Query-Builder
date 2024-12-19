import { useState } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSubmit(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </form>
  );
};