/**
 * Single flag that controls pre-launch vs live mode.
 *
 * Set NEXT_PUBLIC_LAUNCHED=true in Vercel env vars to go live.
 * No code changes needed — just flip the flag and redeploy.
 */
export const IS_LAUNCHED = process.env.NEXT_PUBLIC_LAUNCHED?.toLowerCase() === "true";
