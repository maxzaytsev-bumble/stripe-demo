"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentIntentComplete } from "@/components/PaymentIntentComplete/PaymentIntentComplete";
import { Content } from "@/components/Content/Content";

function PaymentIntentCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    // Redirect to home if payment_intent is missing
    if (!paymentIntent) {
      router.push("/");
    }
  }, [paymentIntent, router]);

  // Don't render if param is missing
  if (!paymentIntent) {
    return <div>Redirecting...</div>;
  }

  return <PaymentIntentComplete paymentIntentId={paymentIntent} />;
}

export default function PaymentIntentCompletePage() {
  return (
    <Content>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentIntentCompleteContent />
      </Suspense>
    </Content>
  );
}
