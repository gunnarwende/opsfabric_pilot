/**
 * Shared utility functions
 */

/** Combine class names, filtering out falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Check if current time is within quiet hours (default 21:00-07:00 Europe/Zurich) */
export function isQuietHours(
  start: string = "21:00",
  end: string = "07:00",
  timezone: string = "Europe/Zurich"
): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  const currentTime = formatter.format(now);
  const [currentH, currentM] = currentTime.split(":").map(Number);
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const currentMinutes = currentH * 60 + currentM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Overnight quiet hours (e.g., 21:00 - 07:00)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Calculate SLA deadline, skipping quiet hours.
 * Returns a human-readable string like "heute bis 16:00" or "morgen bis 10:00"
 */
export function calculateSlaDeadline(
  createdAt: Date,
  slaMinutes: number,
  quietStart: string = "21:00",
  quietEnd: string = "07:00",
  timezone: string = "Europe/Zurich"
): { deadline: Date; displayText: string } {
  const deadline = new Date(createdAt);
  let remainingMinutes = slaMinutes;

  const [qStartH, qStartM] = quietStart.split(":").map(Number);
  const [qEndH, qEndM] = quietEnd.split(":").map(Number);
  const quietStartMinutes = qStartH * 60 + qStartM;
  const quietEndMinutes = qEndH * 60 + qEndM;

  while (remainingMinutes > 0) {
    const hours = deadline.getHours();
    const mins = deadline.getMinutes();
    const currentDayMinutes = hours * 60 + mins;

    // If in quiet hours, skip to end of quiet hours
    if (quietStartMinutes > quietEndMinutes) {
      // Overnight quiet hours
      if (currentDayMinutes >= quietStartMinutes || currentDayMinutes < quietEndMinutes) {
        if (currentDayMinutes >= quietStartMinutes) {
          // Jump to next day's quiet end
          deadline.setDate(deadline.getDate() + 1);
        }
        deadline.setHours(qEndH, qEndM, 0, 0);
        continue;
      }
    }

    // Add one minute at a time (simplified)
    deadline.setMinutes(deadline.getMinutes() + 1);
    remainingMinutes--;
  }

  // Format display text
  const now = new Date();
  const isToday = deadline.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = deadline.toDateString() === tomorrow.toDateString();

  const timeStr = deadline.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });

  let displayText: string;
  if (isToday) {
    displayText = `heute bis ${timeStr}`;
  } else if (isTomorrow) {
    displayText = `morgen bis ${timeStr}`;
  } else {
    const dayName = deadline.toLocaleDateString("de-CH", { weekday: "long", timeZone: timezone });
    displayText = `am ${dayName} bis ${timeStr}`;
  }

  return { deadline, displayText };
}

/** Truncate text to max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "\u2026";
}
