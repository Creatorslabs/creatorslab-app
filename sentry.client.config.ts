import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Public DSN for client
  tracesSampleRate: 1.0, // Adjust this for performance monitoring
});
