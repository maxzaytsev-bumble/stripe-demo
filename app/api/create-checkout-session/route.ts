import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const priceId = formData.get("price_id") as string;
    const uiMode = formData.get("ui_mode") as string | null;

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

    // If custom UI mode requested, create session with ui_mode: "custom"
    if (uiMode === "custom") {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "custom",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode,
        return_url: `${YOUR_DOMAIN}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      });

      return NextResponse.json({
        client_secret: session.client_secret,
        mode,
      });
    }

    // Otherwise, use hosted checkout
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
