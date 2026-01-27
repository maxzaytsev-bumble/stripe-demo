import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type { PaymentIntentStatus } from "@/lib/types";

/**
 * GET /api/payment-intent-status
 * Fetches the status of a Stripe Payment Intent
 */
export async function GET(request: NextRequest) {
  try {
    const paymentIntentId = request.nextUrl.searchParams.get("payment_intent");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "payment_intent is required" },
        { status: 400 },
      );
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["payment_method"],
      },
    );

    // Extract customer email from payment method billing details if available
    const customerEmail =
      paymentIntent.payment_method &&
      typeof paymentIntent.payment_method === "object"
        ? paymentIntent.payment_method.billing_details?.email
        : null;

    // Return payment intent status information
    const response: PaymentIntentStatus = {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer_email: customerEmail,
      payment_method_types: paymentIntent.payment_method_types,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching payment intent status:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch payment intent status",
      },
      { status: 500 },
    );
  }
}
