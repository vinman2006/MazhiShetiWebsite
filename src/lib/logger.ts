/**
 * Mazhi Sheti Structured Logger
 * Emits JSON-formatted structured logs for production observability (Better Stack / Datadog / CloudWatch).
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "security";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  role?: string;
  requestId?: string;
  path?: string;
  error?: string;
}

export const logger = {
  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    const formatted = JSON.stringify(entry);

    switch (level) {
      case "error":
      case "security":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
        break;
    }
  },

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context);
  },

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context);
  },

  error(message: string, error?: any, context?: Record<string, any>) {
    this.log("error", message, {
      ...context,
      error: error instanceof Error ? error.stack || error.message : String(error),
    });
  },

  security(message: string, context?: Record<string, any>) {
    this.log("security", `[SECURITY AUDIT] ${message}`, context);
  },
};

