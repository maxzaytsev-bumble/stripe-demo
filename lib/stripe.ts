import Stripe from "stripe";

/**
 * Server-side Stripe instance
 * WARNING: This file can only be imported in API routes and server components
 * Client components should import from @/lib/types instead
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});
