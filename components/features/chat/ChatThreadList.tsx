import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thread } from "@/types/chat";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatThreadListProps {
  threads: Thread[];
  activeThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onThreadUpdate: (threads: Thread[]) => void;
}

export const ChatThreadList = ({ 
  threads, 
  activeThreadId, 
  onThreadSelect,
  onThreadUpdate 
}: ChatThreadListProps) => {
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleRename = (thread: Thread) => {
    setEditingThread(thread.id);
    setNewTitle(thread.title);
  };

  const handleSaveRename = (threadId: string) => {
    const updatedThreads = threads.map(thread => {
      if (thread.id === threadId) {
        return { ...thread, title: newTitle };
      }
      return thread;
    });
    onThreadUpdate(updatedThreads);
    setEditingThread(null);
    toast.success("Thread renamed successfully");
  };

  const handleDelete = (threadId: string) => {
    const updatedThreads = threads.filter(thread => thread.id !== threadId);
    onThreadUpdate(updatedThreads);
    if (activeThreadId === threadId && updatedThreads.length > 0) {
      onThreadSelect(updatedThreads[0].id);
    }
    toast.success("Thread deleted successfully");
  };

  return (
    <div className="px-2 space-y-1">
      {threads.map(thread => (
        <div key={thread.id} className="flex items-center gap-1">
          {editingThread === thread.id ? (
            <div className="flex-1 flex gap-1">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-8 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveRename(thread.id);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => handleSaveRename(thread.id)}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setEditingThread(null)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant={thread.id === activeThreadId ? "secondary" : "ghost"}
                className="flex-1 justify-start text-xs"
                onClick={() => onThreadSelect(thread.id)}
              >
                {thread.title}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRename(thread)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chat Thread</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this chat thread? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(thread.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      ))}
    </div>
  );
};