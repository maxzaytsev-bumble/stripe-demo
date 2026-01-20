import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type { SessionStatus } from "@/lib/types";

/**
 * GET /api/session-status
 * Fetches the status of a Stripe Checkout session
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 },
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // Return session status information
    const response: SessionStatus = {
      status: session.status || "unknown",
      customer_email: session.customer_email,
      payment_status: session.payment_status || "unknown",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching session status:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch session status",
      },
      { status: 500 },
    );
  }
}
