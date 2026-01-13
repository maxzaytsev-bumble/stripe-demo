import { NextResponse } from "next/server";
import { stripe, type Product } from "@/lib/stripe";
import type Stripe from "stripe";

export async function GET() {
  try {
    // Fetch both recurring (subscriptions) and one-time products
    const [recurringPrices, oneTimePrices] = await Promise.all([
      stripe.prices.list({
        active: true,
        type: "recurring",
        expand: ["data.product"],
      }),
      stripe.prices.list({
        active: true,
        type: "one_time",
        expand: ["data.product"],
      }),
    ]);

    // Process recurring products
    const recurringProducts: Product[] = recurringPrices.data
      .filter((price) => {
        const product = price.product as Stripe.Product;
        return typeof product === "object" && product.active;
      })
      .map((price): Product => {
        const product = price.product as Stripe.Product;
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          priceId: price.id,
          price: price.unit_amount,
          currency: price.currency,
          type: "recurring",
          interval: price.recurring?.interval || "month",
          intervalCount: price.recurring?.interval_count || 1,
        };
      });

    // Process one-time products
    const oneTimeProducts: Product[] = oneTimePrices.data
      .filter((price) => {
        const product = price.product as Stripe.Product;
        return typeof product === "object" && product.active;
      })
      .map((price): Product => {
        const product = price.product as Stripe.Product;
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          priceId: price.id,
          price: price.unit_amount,
          currency: price.currency,
          type: "one_time",
        };
      });

    // Combine both types of products
    const products = [...recurringProducts, ...oneTimeProducts];

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
