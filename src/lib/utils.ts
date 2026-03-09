import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price from cents to display string */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Calculate savings percentage */
export function calcSavingsPercent(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

/** Calculate platform fee (5% of discounted price) */
export function calcPlatformFee(discountedPriceCents: number): number {
  return Math.round(discountedPriceCents * 0.05);
}

/** Calculate total charged to customer */
export function calcTotalCharged(discountedPriceCents: number): number {
  return discountedPriceCents + calcPlatformFee(discountedPriceCents);
}

/** Generate booking reference BL-XXXXXX */
export function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "BL-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/** Format relative time (e.g., "Starts in 2 hours") */
export function getTimeUntil(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs < 0) return "Started";
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `Starts in ${diffMins}m`;
  if (diffHours < 24) return `Starts in ${diffHours}h`;
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format duration in minutes to display string */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/** Get initials from name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Format customer display name (First + Last initial) */
export function formatCustomerName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName.charAt(0)}.`;
}

/** Check if appointment date + duration has passed */
export function isAppointmentPast(
  appointmentDate: Date,
  appointmentTime: string,
  durationMinutes: number
): boolean {
  const [hours, minutes] = appointmentTime.split(":").map(Number);
  const endTime = new Date(appointmentDate);
  endTime.setHours(hours, minutes + durationMinutes, 0, 0);
  return endTime.getTime() < Date.now();
}

/** Check if within cancellation window (24hrs before) */
export function isWithinCancellationWindow(
  appointmentDate: Date,
  appointmentTime: string
): boolean {
  const [hours, minutes] = appointmentTime.split(":").map(Number);
  const startTime = new Date(appointmentDate);
  startTime.setHours(hours, minutes, 0, 0);
  const hoursUntil = (startTime.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil < 24;
}
