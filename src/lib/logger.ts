// src/lib/logger.ts
import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino(
  {
    level: isDevelopment ? "debug" : "info",
    base: { service: "cs2-sniper" },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  isDevelopment
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      })
    : undefined
);
