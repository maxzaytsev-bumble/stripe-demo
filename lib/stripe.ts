import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export type Product = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  priceId: string;
  price: number | null;
  currency: string;
  type: "recurring" | "one_time";
  interval?: string;
  intervalCount?: number;
};

/**
 * Response from hosted checkout session creation
 */
export type HostedCheckoutResponse = {
  url: string;
};

/**
 * Response from custom checkout session creation
 */
export type CustomCheckoutResponse = {
  client_secret: string;
  mode: string;
};

/**
 * Unified checkout response type
 */
export type CheckoutResponse = HostedCheckoutResponse | CustomCheckoutResponse;

/**
 * Session status response from Stripe
 */
export type SessionStatus = {
  status: string;
  customer_email: string | null;
  payment_status: string;
};

/**
 * Type guard for hosted checkout response
 */
export function isHostedCheckoutResponse(
  response: CheckoutResponse,
): response is HostedCheckoutResponse {
  return "url" in response && typeof response.url === "string";
}

/**
 * Type guard for custom checkout response
 */
export function isCustomCheckoutResponse(
  response: CheckoutResponse,
): response is CustomCheckoutResponse {
  return (
    "client_secret" in response &&
    typeof response.client_secret === "string" &&
    "mode" in response &&
    typeof response.mode === "string"
  );
}
