/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { BehaviorSubject } from 'rxjs';
import { toast } from 'react-toastify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// for global loader service
export const isLoading = new BehaviorSubject<boolean>(false);

export const isDialogOpen = new BehaviorSubject<any>({
  open: false,
  data: { message: 'Are you Sure?', title: '' },
  cancelText: 'Cancel',
  confirmText: 'Okay',
  onConfirm: () => { }
});

export const generateUUID = () => {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    if (c === 'x') {
      return r.toString(16);
    } else {
      return ((r & 0x3) | 0x8).toString(16);
    }
  });
};

const ninetySeven = 97;
export const indexToLetter = (index: number) =>
  String.fromCharCode(ninetySeven + index);

export function generateUniqueId(prefix = 'id') {
  // Generate a random number and convert it to a base36 string
  const thirtySix = 36;
  const randomString = Math.random().toString(thirtySix).substring(2);
  // Create a unique ID by combining the prefix and random string
  return `${prefix}-${randomString}`;
}

export function generateUniqueNumber() {
  // Gets the current time in milliseconds
  const timestamp = Date.now();
  // Generates a random decimal number between 0 and 1
  const randomComponent = Math.random();
  // Combines and converts them into a unique number
  return Number(`${timestamp}${Math.floor(randomComponent * 1000)}`);
}

export const forSuccess = (message: string, id?: string) =>
  toast.success(message, { autoClose: 3000, toastId: id ?? 1 });

export const forError = (message: string, id?: string) =>
  toast.error(message, { autoClose: 3000, toastId: id ?? 1 });

export const forWarning = (message: string, id?: string) =>
  toast.warning(message, { autoClose: 3000, toastId: id ?? 1 });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce utility function
export type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 1000
): DebouncedFunction<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>): void {
    const context = this as unknown;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, delay);
  };
};

export const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

export const phoneValidationRule = {
  message: 'Please enter a valid US phone number (10 digits)',
  rule: (val: any) => {
    if (!val) return false;
    // Remove all non-digit characters for validation
    const digits = val.replace(/\D/g, '');
    // Must be exactly 10 digits
    return digits.length === 10;
  }
};
export interface DownloadOptions {
  filename?: string;
  openInNewTabOnFail?: boolean;
}

export async function downloadFromUrl(url: string, options: DownloadOptions = {}): Promise<void> {
  if (!url) return;
  const { filename, openInNewTabOnFail = true } = options;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    if (filename) link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (_) {
    if (openInNewTabOnFail) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

// Date formatting functions
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const formatDateLong = (date: Date | null | undefined): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export function buildSafeFilename(baseName: string, extension?: string): string {
  const safeBase = (baseName || 'resource').trim().replace(/[^a-zA-Z0-9-_. ]/g, '_');
  if (!extension) return safeBase;
  return `${safeBase}.${extension}`;
}

export function getFileExtensionFromUrlOrType(url: string, mimeType?: string): string | undefined {
  try {
    const { pathname } = new URL(url);
    const extFromUrl = pathname.includes('.') ? pathname.split('.').pop() || '' : '';
    if (extFromUrl) return extFromUrl;
  } catch (_) {
    // ignore URL parse errors, fall back to mime
  }
  const extFromType = mimeType?.includes('/') ? mimeType.split('/')[1] : '';
  return extFromType || undefined;
}

export async function downloadResource(params: { title: string; fileUrl: string; mimeType?: string }): Promise<void> {
  const { title, fileUrl, mimeType } = params;
  const extension = getFileExtensionFromUrlOrType(fileUrl, mimeType);
  const filename = buildSafeFilename(title, extension);
  return downloadFromUrl(fileUrl, { filename });
}

/**
 * Get file extension with dot prefix (e.g., ".jpg", ".png")
 * Converts jpeg to jpg for consistency
 */
export function getFileExtension(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  // Return .jpg or .png (with dot)
  const ext = extension === 'jpeg' ? 'jpg' : extension;
  return `.${ext}`;
}

/**
 * Generate file path in uploads/ directory format
 * Format: uploads/baseName_timestamp_random.extension
 */
export function generateUploadsFileName(file: File): string {
  const extension = getFileExtension(file).replace('.', ''); // Remove dot for filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const baseName = file.name
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars
    .substring(0, 30); // Limit length
  return `uploads/${baseName}_${timestamp}_${random}.${extension}`;
}

// for videocall service
export const generateAvatarUrl = (firstName: string, lastName: string): string => {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
};
 export const stopMediaTracks = (call: any) => {
    const localStream = call?.localStream;
    if (localStream) {
      localStream.getTracks().forEach((track: MediaStreamTrack) => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    }
  }

export const timeToMinutes = (time: string): number => {
  const [timePart, period] = time.split(/(am|pm)/i);
  const [hoursStr, minutesStr] = timePart.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  let totalMinutes = hours * 60 + minutes;
  if (period.toLowerCase() === "pm" && hours !== 12) {
    totalMinutes += 12 * 60;
  }
  if (period.toLowerCase() === "am" && hours === 12) {
    totalMinutes -= 12 * 60;
  }
  return totalMinutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "pm" : "am";

  let displayHours = hours;
  if (hours > 12) {
    displayHours = hours - 12;
  } else if (hours === 0) {
    displayHours = 12;
  }

  return `${displayHours}:${mins.toString().padStart(2, "0")}${period}`;
};

export function formatHHMMSSTo12Hour(time: string): string {
  if (!time) return '';
  // Expecting HH:mm:ss
  const [hStr, mStr] = time.split(":");
  let hours = Number(hStr);
  const minutes = Number(mStr);
  const period = hours >= 12 ? 'pm' : 'am';
  if (hours === 0) hours = 12;
  if (hours > 12) hours = hours - 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format date as YYYY-MM-DD in local timezone (avoid UTC shift from toISOString)
export function formatLocalYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

