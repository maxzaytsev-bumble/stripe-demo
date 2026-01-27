"use client";

import useSWR from "swr";
import { Logo } from "@/components/Logo/Logo";
import { fetcher } from "@/lib/fetcher";
import type { PaymentIntentStatus } from "@/lib/types";
import styles from "./PaymentIntentComplete.module.css";

type PaymentIntentCompleteProps = {
  paymentIntentId: string;
};

export function PaymentIntentComplete({
  paymentIntentId,
}: PaymentIntentCompleteProps) {
  const {
    data: status,
    error,
    isLoading,
  } = useSWR<PaymentIntentStatus>(
    `/api/payment-intent-status?payment_intent=${paymentIntentId}`,
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
          {error?.message || "Failed to load payment status"}
        </div>
      </div>
    );
  }

  const isSucceeded = status.status === "succeeded";
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: status.currency.toUpperCase(),
  }).format(status.amount / 100);

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.logo}>
          <Logo />
        </div>

        {isSucceeded ? (
          <>
            <div className={styles.successIcon}>🎉</div>
            <h1 className={styles.title}>Payment successful!</h1>
            <p className={styles.subtitle}>
              {status.customer_email
                ? `Thank you for your purchase. A confirmation has been sent to ${status.customer_email}.`
                : "Thank you for your purchase."}
            </p>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Amount:</span>
                <span className={styles.detailValue}>{formattedAmount}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment status:</span>
                <span className={styles.detailValue}>{status.status}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment method:</span>
                <span className={styles.detailValue}>
                  {status.payment_method_types.join(", ")}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Intent ID:</span>
                <span className={styles.detailValue}>{paymentIntentId}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.warningIcon}>⚠️</div>
            <h1 className={styles.title}>Payment processing</h1>
            <p className={styles.subtitle}>
              Your payment is being processed. Status: {status.status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
