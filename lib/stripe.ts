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
