"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckoutComplete } from "@/components/CheckoutComplete/CheckoutComplete";

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    // Redirect to paywall if session_id is missing
    if (!session_id) {
      router.push("/paywall");
    }
  }, [session_id, router]);

  // Don't render if param is missing
  if (!session_id) {
    return <div>Redirecting...</div>;
  }

  return <CheckoutComplete sessionId={session_id} />;
}

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutCompleteContent />
    </Suspense>
  );
}
