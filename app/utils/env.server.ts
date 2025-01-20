/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  PRIMUS_APP_ID: z.string().default('MOCK_PRIMUS_APP_ID'),
  PRIMUS_APP_SECRET: z.string().default('MOCK_PRIMUS_APP_SECRET'),
  // If using database and sessions uncomment these
  //   DATABASE_PATH: z.string(),
  //   DATABASE_URL: z.string(),
  //   SESSION_SECRET: z.string(),
  //   INTERNAL_COMMAND_TOKEN: z.string(),
  //   HONEYPOT_SECRET: z.string(),
  // If you plan on using Sentry, uncomment this line
  // SENTRY_DSN: z.string(),
  // If you plan to use Resend, uncomment this line
  // RESEND_API_KEY: z.string(),
  // If you plan to use GitHub auth, remove the default:
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env)

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)

    throw new Error('Invalid environment variables')
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    // SENTRY_DSN: process.env.SENTRY_DSN,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  let ENV: ENV
  interface Window {
    ENV: ENV
  }
}
