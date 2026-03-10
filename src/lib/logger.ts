/**
 * Lightweight structured logger for production events.
 * Outputs JSON to stdout for Vercel log ingestion.
 *
 * Usage:
 *   logger.info("BOOKING_CREATED", { bookingId, customerId, amount })
 *   logger.warn("PAYOUT_FAILED", { professionalId, reason })
 *   logger.error("WEBHOOK_ERROR", { error: err.message })
 */

type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  [key: string]: unknown;
}

function log(level: LogLevel, event: string, data?: LogPayload) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (event: string, data?: LogPayload) => log("info", event, data),
  warn: (event: string, data?: LogPayload) => log("warn", event, data),
  error: (event: string, data?: LogPayload) => log("error", event, data),
};
