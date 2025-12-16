/**
 * Formats a timestamp to a human-readable date and time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string (e.g., "Dec 15, 2024 at 3:45 PM")
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  let dateStr: string;
  
  if (dateOnly.getTime() === today.getTime()) {
    dateStr = 'Today';
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    dateStr = 'Yesterday';
  } else {
    // Format as "Dec 15, 2024"
    dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
  
  // Format time as "3:45 PM"
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return `${dateStr} at ${timeStr}`;
}

/**
 * Formats a timestamp to a short date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Short formatted date string (e.g., "Dec 15" or "Today at 3:45 PM")
 */
export function formatShortDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateOnly.getTime() === today.getTime()) {
    // For today, show time only
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  // For other dates, show "Dec 15"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

