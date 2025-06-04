import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combines class names with Tailwind's class merging
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Request camera permissions
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Clean up stream
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
}

// Format a title for display
export function formatTitle(title: string): string {
  return title.charAt(0).toUpperCase() + title.slice(1);
}

// Generate a random ID
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Delay execution with promise
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}