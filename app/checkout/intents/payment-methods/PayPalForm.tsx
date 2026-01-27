import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import styles from "./PayPalForm.module.css";

export const PayPalForm = ({
  clientSecret,
  onProcessing,
  onError,
}: {
  clientSecret: string;
  onProcessing: (isProcessing: boolean) => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const [email, setEmail] = useState("");

  const handlePayPalPayment = async () => {
    if (!stripe || !email) {
      onError("Please enter your email");
      return;
    }

    onProcessing(true);

    try {
      // First, create a payment method for PayPal
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "paypal",
          billing_details: {
            email,
          },
        });

      if (pmError || !paymentMethod) {
        onError(pmError?.message || "Failed to create payment method");
        onProcessing(false);
        return;
      }

      // Then confirm the payment with the payment method ID
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: paymentMethod.id,
          return_url: `${window.location.origin}/checkout/intents/complete`,
        },
      });

      if (error) {
        onError(error.message || "PayPal payment failed");
        onProcessing(false);
      }
      // If successful, user will be redirected to PayPal, then back to return_url
    } catch (err) {
      onError("An unexpected error occurred");
      onProcessing(false);
    }
  };

  return (
    <div className={styles.paypalForm}>
      <div className={styles.formField}>
        <label>Email Address</label>
        <input
          type="email"
          className={styles.input}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <p className={styles.paypalNote}>
        You will be redirected to PayPal to complete your payment securely.
      </p>
      <button
        type="button"
        className={styles.paypalButton}
        onClick={handlePayPalPayment}
        disabled={!stripe || !email}
      >
        Continue with PayPal
      </button>
    </div>
  );
};
