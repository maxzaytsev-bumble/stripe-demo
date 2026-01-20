/**
 * Client-side Stripe initialization
 * Uses the publishable key (safe to expose in browser)
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * Gets or creates a Stripe instance for client-side use
 * @returns Promise that resolves to Stripe instance
 */
export function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable",
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}
