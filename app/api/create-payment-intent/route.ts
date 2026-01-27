import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const priceId = formData.get("price_id") as string;

  try {
    const price = await stripe.prices.retrieve(priceId);

    if (!price.unit_amount) {
      return NextResponse.error();
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      // automatic_payment_methods enables all payment methods configured in your
      // Stripe Dashboard (including card, PayPal, etc.). Make sure PayPal is enabled
      // in Dashboard > Settings > Payment methods for PayPal to work.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    const error = new Error((err as Error)?.message || "Unknown error");
    console.log({ error });
    return NextResponse.error();
  }
}
