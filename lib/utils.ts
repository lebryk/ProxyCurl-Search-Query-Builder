import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateObject } from "@/types/PersonSearch"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeEmojis(text: string): string {
  // Remove emojis and other special characters, keeping only letters, numbers, and basic punctuation
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '');
}

export function formatDateObject(date: DateObject | null): string {
  if (!date) return '';
  
  const { month, year, day } = date;
  
  // If only year is available
  if (year && !month) {
    return year.toString();
  }
  
  // If year and month are available
  if (year && month) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2000, month - 1));
    
    // If day is also available
    if (day) {
      return `${monthName} ${day}, ${year}`;
    }
    
    return `${monthName} ${year}`;
  }
  
  return '';
}
