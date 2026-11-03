/**
 * Operational Monitoring & Error Tracking Adapter (Sentry & Better Stack)
 * Only initializes external logging when proper credentials exist in the environment.
 */

export interface MonitoringConfig {
  sentryDsn?: string;
  betterStackToken?: string;
  environment: string;
}

export const monitoringConfig: MonitoringConfig = {
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  betterStackToken: process.env.BETTER_STACK_TOKEN,
  environment: process.env.NODE_ENV || "development",
};

export function captureException(error: any, context?: Record<string, any>) {
  if (monitoringConfig.sentryDsn) {
    // Sentry SDK capture call would run here
    console.error("[Sentry Error Captured]:", error, context);
  } else {
    // Local fallback log
    console.warn("[Local Fallback Exception Log]:", error?.message || error, context);
  }
}

export function reportHeartbeat(status: "healthy" | "degraded" | "unhealthy", details?: Record<string, any>) {
  if (monitoringConfig.betterStackToken) {
    // Better Stack heartbeat ping
    console.log("[Better Stack Heartbeat Dispatched]:", status, details);
  }
}

