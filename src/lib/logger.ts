type LogLevel = "log" | "warn" | "error" | "info";

const isDev = process.env.NODE_ENV === "development";

// Check if it's running in the browser or server
const isBrowser = typeof window !== "undefined";

function formatPrefix(level: LogLevel) {
  const env = isBrowser ? "Client" : "Server";
  return `[${env.toUpperCase()} ${level.toUpperCase()}]`;
}

function log(level: LogLevel, ...args: any[]) {
  if (!isDev) return;

  const prefix = formatPrefix(level);

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
}

export const logger = {
  log: (...args: any[]) => log("log", ...args),
  warn: (...args: any[]) => log("warn", ...args),
  error: (...args: any[]) => log("error", ...args),
  info: (...args: any[]) => log("info", ...args),
};
