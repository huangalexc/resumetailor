/**
 * Environment Variable Validation
 * Ensures required environment variables are present at runtime
 */

/**
 * Server-side environment variables
 * These are validated when the server starts
 */
export function validateServerEnv() {
  const requiredVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }

  const missing: string[] = []

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
        `Please add them to your .env.local file:\n` +
        missing.map((key) => `${key}=your-value-here`).join('\n')
    )
  }

  // Validate format
  if (
    requiredVars.OPENAI_API_KEY &&
    !requiredVars.OPENAI_API_KEY.startsWith('sk-')
  ) {
    console.warn(
      '⚠️  Warning: OPENAI_API_KEY does not start with "sk-". This may be an invalid key.'
    )
  }

  console.log('✅ Environment variables validated successfully')
}

/**
 * Get OpenAI API key with validation
 */
export function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY

  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Please add it to your .env.local file.'
    )
  }

  return key
}
