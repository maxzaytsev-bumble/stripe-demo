/**
 * Shared Product type used across client and server
 */
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

export type PaymentIntentResponse = {
  clientSecret: string;
};

/**
 * Session status response from Stripe
 */
export type SessionStatus = {
  status: string;
  customer_email: string | null;
  payment_status: string;
};

/**
 * Payment Intent status response from Stripe
 */
export type PaymentIntentStatus = {
  status: string;
  amount: number;
  currency: string;
  customer_email: string | null;
  payment_method_types: string[];
};

/**
 * Checkout details response (product and price info)
 */
export type CheckoutDetails = {
  product: {
    name: string;
    description: string | null;
  } | null;
  price: {
    amount: number | null;
    currency: string;
    recurring: {
      interval: string;
      interval_count: number;
    } | null;
  } | null;
};
