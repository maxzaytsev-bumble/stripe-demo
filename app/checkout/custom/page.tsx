"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { getStripePromise } from "@/lib/stripe-client";
import { CustomCheckoutForm } from "@/components/CustomCheckoutForm/CustomCheckoutForm";

function CustomCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const client_secret = searchParams.get("client_secret");
  const mode = searchParams.get("mode");

  useEffect(() => {
    // Redirect to paywall if required params are missing
    if (!client_secret || !mode) {
      router.push("/paywall");
    }
  }, [client_secret, mode, router]);

  // Don't render if params are missing
  if (!client_secret || !mode) {
    return <div>Redirecting...</div>;
  }

  const stripePromise = getStripePromise();

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{
        clientSecret: client_secret,
        elementsOptions: {
          appearance: { theme: "stripe" },
        },
      }}
    >
      <CustomCheckoutForm mode={mode} />
    </CheckoutProvider>
  );
}

export default function CustomCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CustomCheckoutContent />
    </Suspense>
  );
}
