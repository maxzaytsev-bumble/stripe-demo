import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const priceId = formData.get("price_id") as string;

    if (!priceId) {
      return NextResponse.json(
        { error: "price_id is required" },
        { status: 400 },
      );
    }

    if (!priceId.startsWith("price_")) {
      return NextResponse.json(
        { error: "Invalid price_id format" },
        { status: 400 },
      );
    }

    // Fetch the price to determine its type
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === "recurring" ? "subscription" : "payment";

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
      mode,
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
