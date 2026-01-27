/**
 * Feature flag utility for experimental features
 */

/**
 * Checks if custom Stripe Elements checkout is enabled
 * @returns true if custom checkout should be used, false for hosted checkout
 */
export function useCustomCheckout(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_CUSTOM_CHECKOUT === "true" ||
    process.env.NEXT_PUBLIC_USE_CUSTOM_CHECKOUT === "1"
  );
}

export function useCustomUiForIntents() {
  return (
    process.env.NEXT_PUBLIC_USE_CUSTOM_PAYMENT_TABS === "true" ||
    process.env.NEXT_PUBLIC_USE_CUSTOM_PAYMENT_TABS === "1"
  );
}
