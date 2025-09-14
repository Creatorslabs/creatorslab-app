// lib/logger.ts
type LogLevel = "log" | "warn" | "error" | "info";

const isDev = process.env.NODE_ENV === "development";
const isBrowser = typeof window !== "undefined";

async function sendToServer(level: LogLevel, message: string, meta?: any) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        meta,
        isClient: isBrowser,
      }),
    });
  } catch (e) {
    // fail silently to not block UI
  }
}

function log(level: LogLevel, ...args: any[]) {
  const prefix = `[${isBrowser ? "CLIENT" : "SERVER"} ${level.toUpperCase()}]`;
  const message = args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");

  if (isDev) {
    switch (level) {
      case "log":
        console.log(prefix, ...args);
        break;
      case "warn":
        console.warn(prefix, ...args);
        break;
      case "error":
        console.error(prefix, ...args);
        break;
      case "info":
        console.info(prefix, ...args);
        break;
    }
  } else {
    // send to DB in production
    sendToServer(level, message, args);
  }
}

export const logger = {
  log: (...args: any[]) => log("log", ...args),
  warn: (...args: any[]) => log("warn", ...args),
  error: (...args: any[]) => log("error", ...args),
  info: (...args: any[]) => log("info", ...args),
};
