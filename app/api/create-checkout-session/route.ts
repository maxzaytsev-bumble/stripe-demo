import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const lookup_key = formData.get("lookup_key") as string;

    if (!lookup_key) {
      return NextResponse.json(
        { error: "lookup_key or price_id is required" },
        { status: 400 },
      );
    }

    let priceId: string;

    // Check if the lookup_key is actually a price ID (starts with "price_")
    if (lookup_key.startsWith("price_")) {
      priceId = lookup_key;
    } else {
      // It's a lookup key, so we need to look up the price
      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key],
        expand: ["data.product"],
      });

      if (!prices.data.length) {
        return NextResponse.json(
          { error: "Price not found for the given lookup_key" },
          { status: 404 },
        );
      }

      priceId = prices.data[0].id;
    }

    const YOUR_DOMAIN =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/paywall?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/paywall?canceled=true`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
