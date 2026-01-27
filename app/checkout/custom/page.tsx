"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { getStripePromise } from "@/lib/stripe-client";
import { CustomCheckoutForm } from "@/components/CustomCheckoutForm/CustomCheckoutForm";
import { fetcher } from "@/lib/fetcher";
import { type CheckoutDetails } from "@/lib/types";

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

  // Fetch checkout details from the backend
  const { data: checkoutDetails } = useSWR<CheckoutDetails>(
    client_secret
      ? `/api/checkout-details?client_secret=${encodeURIComponent(client_secret)}`
      : null,
    fetcher,
  );

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
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#ffd54f",
              colorBackground: "#ffffff",
              colorText: "#000000",
              colorDanger: "#df1b41",
              fontFamily: "system-ui, sans-serif",
              spacingUnit: "4px",
              borderRadius: "12px",
            },
            rules: {
              ".AccordionItem": {
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#f5f5f5",
                boxShadow: "none",
              },
              ".AccordionItem:hover": {
                backgroundColor: "#ebebeb",
              },
              ".AccordionItem--selected": {
                backgroundColor: "#ffdb5b",
                border: "2px solid #ffd54f",
                color: "#000000",
              },
              ".AccordionItem--selected:hover": {
                backgroundColor: "#ffdb5b",
              },
              ".Input": {
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: "#ffffff",
              },
              ".Input:focus": {
                border: "2px solid #ffd54f",
                boxShadow: "0 0 0 3px rgba(255, 213, 79, 0.1)",
              },
              ".Label": {
                fontWeight: "600",
                fontSize: "14px",
                color: "#000000",
              },
              ".RadioIcon": {
                width: "24px",
              },
              ".RadioIconOuter": {
                stroke: "#000000",
                strokeWidth: "2",
                fill: "#ffffff",
              },
              ".RadioIconOuter--checked": {
                stroke: "#000000",
                strokeWidth: "2",
                fill: "#ffffff",
              },
              ".RadioIconInner": {
                fill: "transparent",
                r: "0",
              },
              ".RadioIconInner--checked": {
                fill: "#000000",
                r: "24",
                stroke: "#ffffff",
                strokeWidth: "3",
              },
            },
          },
        },
      }}
    >
      <CustomCheckoutForm
        mode={mode}
        product={checkoutDetails?.product ?? null}
        price={checkoutDetails?.price ?? null}
      />
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
