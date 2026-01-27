import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import styles from "./CardForm.module.css";

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

export const CardForm = ({
  clientSecret,
  onProcessing,
  onError,
}: {
  clientSecret: string;
  onProcessing: (isProcessing: boolean) => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      onError("Stripe has not loaded yet");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      onError("Card element not found");
      return;
    }

    setIsLoading(true);
    onProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Redirect to Payment Intent success page
        window.location.href = `/checkout/intents/complete?payment_intent=${paymentIntent.id}`;
      }
    } catch (err) {
      onError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  return (
    <div className={styles.cardForm}>
      <div className={styles.formField}>
        <label>Card Number</label>
        <CardNumberElement options={cardElementOptions} />
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label>Expiry Date</label>
          <CardExpiryElement options={cardElementOptions} />
        </div>
        <div className={styles.formField}>
          <label>CVC</label>
          <CardCvcElement options={cardElementOptions} />
        </div>
      </div>
      <button
        type="button"
        className={styles.cardButton}
        onClick={handleCardPayment}
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Processing..." : "Pay with Card"}
      </button>
    </div>
  );
};
