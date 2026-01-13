import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

// This is needed to allow Stripe to send raw body for signature verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No stripe-signature header found" },
      { status: 400 },
    );
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    // Only verify the event if you have an endpoint secret defined.
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      // If no webhook secret is defined, use the basic event deserialized with JSON.parse
      event = JSON.parse(body);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`⚠️  Webhook signature verification failed.`, errorMessage);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription status is ${subscription.status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription status is ${subscription.status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscription);
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription status is ${subscription.status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription status is ${subscription.status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    }

    case "entitlements.active_entitlement_summary.updated": {
      const subscription = event.data.object;
      console.log(`Active entitlement summary updated for ${subscription}.`);
      // Then define and call a method to handle active entitlement summary updated
      // handleEntitlementUpdated(subscription);
      break;
    }

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
