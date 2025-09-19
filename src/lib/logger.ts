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

  // serialize args safely
  const serializedArgs = args.map((a) => {
    try {
      return typeof a === "string" ? a : JSON.stringify(a);
    } catch {
      return String(a); // fallback if circular
    }
  });

  const message = serializedArgs.join(" ");

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
    if (level === "log" || level === "info") return; // skip less important logs
    sendToServer(level, message, serializedArgs);
  }
}

export const logger = {
  log: (...args: any[]) => log("log", ...args),
  warn: (...args: any[]) => log("warn", ...args),
  error: (...args: any[]) => log("error", ...args),
  info: (...args: any[]) => log("info", ...args),
};
