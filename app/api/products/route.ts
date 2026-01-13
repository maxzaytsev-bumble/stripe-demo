import { NextResponse } from "next/server";
import { stripe, type Product } from "@/lib/stripe";
import type Stripe from "stripe";

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      expand: ["data.product"],
    });

    // Filter to only include products that are active
    const products: Product[] = prices.data
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
          interval: price.recurring?.interval || "month",
          intervalCount: price.recurring?.interval_count || 1,
        };
      });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
