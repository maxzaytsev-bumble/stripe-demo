"use client";

import useSWR from "swr";
import { Logo } from "@/components/Logo/Logo";
import { fetcher } from "@/lib/fetcher";
import { BillingPortalForm } from "@/components/BillingPortalForm/BillingPortalForm";
import type { SessionStatus } from "@/lib/stripe";
import styles from "./CheckoutComplete.module.css";

type CheckoutCompleteProps = {
  sessionId: string;
};

export function CheckoutComplete({ sessionId }: CheckoutCompleteProps) {
  const {
    data: status,
    error,
    isLoading,
  } = useSWR<SessionStatus>(
    `/api/session-status?session_id=${sessionId}`,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Logo />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className={styles.container}>
        <Logo />
        <div className={styles.error}>
          {error?.message || "Failed to load checkout status"}
        </div>
      </div>
    );
  }

  const isComplete = status.status === "complete";
  const isPaid = status.payment_status === "paid";

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.logo}>
          <Logo />
        </div>

        {isComplete && isPaid ? (
          <>
            <div className={styles.successIcon}>🎉</div>
            <h1 className={styles.title}>Payment successful!</h1>
            <p className={styles.subtitle}>
              Thank you for your purchase. A confirmation has been sent to{" "}
              {status.customer_email || "your email"}.
            </p>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment status:</span>
                <span className={styles.detailValue}>
                  {status.payment_status}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Session ID:</span>
                <span className={styles.detailValue}>{sessionId}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.warningIcon}>⚠️</div>
            <h1 className={styles.title}>Payment processing</h1>
            <p className={styles.subtitle}>
              Your payment is being processed. Status: {status.payment_status}
            </p>
          </>
        )}
      </div>

      <BillingPortalForm sessionId={sessionId} />
    </div>
  );
}
