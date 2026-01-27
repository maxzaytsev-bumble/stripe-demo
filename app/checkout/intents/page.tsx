"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance } from "@stripe/stripe-js";
import { getStripePromise } from "@/lib/stripe-client";
import { IntentsCheckout } from "@/app/checkout/intents/intents-checkout";
import { Content } from "@/components/Content/Content";

const stripePromise = getStripePromise();

const IntentsCheckoutContent = () => {
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get("client_secret") || "";
  const appearance: Appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <Elements
      options={{ clientSecret, appearance, loader }}
      stripe={stripePromise}
    >
      <IntentsCheckout clientSecret={clientSecret} />
    </Elements>
  );
};

export default function IntentsCheckoutPage() {
  return (
    <Content>
      <Suspense fallback={<div>Loading checkout...</div>}>
        <IntentsCheckoutContent />
      </Suspense>
    </Content>
  );
}
