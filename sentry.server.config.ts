import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Private DSN for server
  tracesSampleRate: 1.0,
});
