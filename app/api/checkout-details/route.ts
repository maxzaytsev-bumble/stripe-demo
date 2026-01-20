import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientSecret = searchParams.get("client_secret");

    if (!clientSecret) {
      return NextResponse.json(
        { error: "client_secret is required" },
        { status: 400 },
      );
    }

    // Extract session ID from client_secret
    // Format: cs_test_{sessionId}_secret_{secret} or cs_live_{sessionId}_secret_{secret}
    const sessionId = clientSecret.split("_secret_")[0];

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Invalid client_secret format" },
        { status: 400 },
      );
    }

    // Retrieve the session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    // Extract product details from the first line item
    const lineItem = session.line_items?.data[0];
    const priceData = lineItem?.price;
    const productData =
      priceData?.product && typeof priceData.product === "object"
        ? priceData.product
        : null;

    return NextResponse.json({
      product:
        productData && !productData.deleted
          ? {
              name: productData.name,
              description: productData.description,
            }
          : null,
      price: priceData
        ? {
            amount: priceData.unit_amount,
            currency: priceData.currency,
            recurring: priceData.recurring,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout details" },
      { status: 500 },
    );
  }
}
