"use client";

import { useState, FormEvent } from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/Button/Button";
import { EmailInput } from "@/components/EmailInput/EmailInput";
import { Summary } from "@/components/Summary/Summary";
import styles from "./CustomCheckoutForm.module.css";

type CustomCheckoutFormProps = {
  mode: string;
  product: {
    name: string;
    description: string | null;
  } | null;
  price: {
    amount: number | null;
    currency: string;
    recurring: {
      interval: string;
      interval_count: number;
    } | null;
  } | null;
};

export function CustomCheckoutForm({
  mode,
  product,
  price,
}: CustomCheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkoutState = useCheckout();

  if (checkoutState.type === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading checkout...</div>
      </div>
    );
  }

  if (checkoutState.type === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading checkout: {checkoutState.error.message}
        </div>
      </div>
    );
  }

  const { checkout } = checkoutState;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Validate and update email
      if (!email || !email.includes("@")) {
        setMessage("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      const updateResult = await checkout.updateEmail(email);
      if (updateResult.type === "error") {
        setMessage(updateResult.error.message);
        setIsLoading(false);
        return;
      }

      // Confirm payment
      const confirmResult = await checkout.confirm();
      if (confirmResult.type === "error") {
        setMessage(confirmResult.error.message);
        setIsLoading(false);
      }
      // On success, Stripe automatically redirects to the return_url
      // that was set when creating the checkout session on the server.
      // No explicit redirect needed here - the browser is already navigating.
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Your purchase</h1>

        <Summary product={product} price={price} />

        <form onSubmit={handleSubmit} className={styles.form}>
          {Boolean(1) ? null : (
            <EmailInput
              email={email}
              onChange={setEmail}
              disabled={isLoading}
            />
          )}

          <div className={styles.field}>
            <label className={styles.sectionLabel}>Payment method</label>
            <div className={styles.paymentElement}>
              <PaymentElement
                options={{
                  layout: {
                    type: "accordion",
                    defaultCollapsed: false,
                    radios: true,
                    spacedAccordionItems: true,
                  },
                }}
              />
            </div>
          </div>

          {message && <div className={styles.message}>{message}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Processing..." : "Accept and Pay"}
          </Button>

          <p className={styles.disclaimer}>
            {mode === "subscription"
              ? `Recurring Billing. Cancel Anytime. You will be charged ${price ? formatPrice(price.amount, price.currency) : ""} - the ${mode === "subscription" ? "subscription" : "payment"} is processed immediately, and the billing cycle is updated based on the day you ${mode === "subscription" ? "subscribe" : "purchase"}. You will be charged the full amount for each billing period.`
              : `One-time payment. You will be charged ${price ? formatPrice(price.amount, price.currency) : ""} immediately.`}
          </p>
        </form>
      </div>
    </div>
  );
}
