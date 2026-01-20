"use client";

import { useState, FormEvent } from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { Button } from "@/components/Button/Button";
import { Logo } from "@/components/Logo/Logo";
import styles from "./CustomCheckoutForm.module.css";

type CustomCheckoutFormProps = {
  mode: string;
};

export function CustomCheckoutForm({ mode }: CustomCheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkoutState = useCheckout();

  if (checkoutState.type === "loading") {
    return (
      <div className={styles.container}>
        <Logo />
        <div className={styles.loading}>Loading checkout...</div>
      </div>
    );
  }

  if (checkoutState.type === "error") {
    return (
      <div className={styles.container}>
        <Logo />
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
      <Logo />
      <div className={styles.card}>
        <h1 className={styles.title}>
          {mode === "subscription" ? "Subscribe" : "Complete Purchase"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Payment details</label>
            <div className={styles.paymentElement}>
              <PaymentElement />
            </div>
          </div>

          {message && <div className={styles.message}>{message}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Processing..." : "Pay now"}
          </Button>
        </form>
      </div>
    </div>
  );
}
