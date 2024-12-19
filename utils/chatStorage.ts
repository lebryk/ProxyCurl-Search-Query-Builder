import { Thread, Message } from '@/types/chat';

const STORAGE_KEY = 'chat_threads';

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hi! I need help creating a search query for a Product Manager position.",
    sender: 'user',
    timestamp: new Date('2024-03-10T10:00:00')
  },
  {
    id: 2,
    text: "I'll help you create an effective search query. Would you like to start with specific skills or experience requirements?",
    sender: 'ai',
    timestamp: new Date('2024-03-10T10:00:05')
  },
  {
    id: 3,
    text: "Let's start with skills. I need someone with experience in Agile methodologies and product strategy.",
    sender: 'user',
    timestamp: new Date('2024-03-10T10:00:30')
  },
  {
    id: 4,
    text: "I'll help you add those skills. I've updated the skills section with 'Agile Methodologies' and 'Product Strategy'. Would you like to specify any particular years of experience with these skills?",
    sender: 'ai',
    timestamp: new Date('2024-03-10T10:00:35')
  }
];

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Product Manager Search',
    messages: mockMessages,
    createdAt: new Date('2024-03-10T10:00:00'),
    updatedAt: new Date('2024-03-10T10:00:35')
  }
];

export const saveThreads = (threads: Thread[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

export const loadThreads = (): Thread[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (!stored) {
    saveThreads(mockThreads);
    return mockThreads;
  }
  
  try {
    const threads = JSON.parse(stored);
    return threads.map((thread: Thread) => ({
      ...thread,
      createdAt: new Date(thread.createdAt),
      updatedAt: new Date(thread.updatedAt),
      messages: thread.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading threads:', error);
    return mockThreads;
  }
};

export const createNewThread = (initialMessage: string): Thread => ({
  id: crypto.randomUUID(),
  title: initialMessage.slice(0, 30) + (initialMessage.length > 30 ? '...' : ''),
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date()
});