import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEventHandler, useState } from "react";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { IntentsWithCustomUiComponents } from "@/app/checkout/intents/intents-with-custom-ui-components";

// hard-coded by default
const FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED = Boolean(Math.random());

export const IntentsCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/complete",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Unknown error");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const renderFormContent = () => {
    if (FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED) {
      return <IntentsWithCustomUiComponents />;
    } else {
      return (
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      );
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {renderFormContent()}
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
