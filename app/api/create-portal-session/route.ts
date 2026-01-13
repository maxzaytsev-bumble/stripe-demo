import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const session_id = formData.get("session_id") as string;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 },
      );
    }

    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!checkoutSession.customer) {
      return NextResponse.json(
        { error: "No customer found for this session" },
        { status: 404 },
      );
    }

    const YOUR_DOMAIN =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // This is the url to which the customer will be redirected when they're done
    // managing their billing with the portal.
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: YOUR_DOMAIN,
    });

    return NextResponse.redirect(portalSession.url, 303);
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
