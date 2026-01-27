import { FormEventHandler, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCustomUiForIntents } from "@/lib/feature-flags";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { IntentsWithCustomUiComponents } from "@/app/checkout/intents/intents-with-custom-ui-components";

export const IntentsCheckout = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED = useCustomUiForIntents();

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  // This handler is only for PaymentElement flow
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/intents/complete`,
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Unknown error");
        } else {
          setMessage("An unexpected error occurred.");
        }
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const handleProcessing = (processing: boolean) => {
    setIsLoading(processing);
  };

  const handleError = (errorMessage: string) => {
    setMessage(errorMessage);
  };

  // Render custom components with individual submit buttons
  if (FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED) {
    return (
      <div id="payment-form">
        <IntentsWithCustomUiComponents
          clientSecret={clientSecret}
          onProcessing={handleProcessing}
          onError={handleError}
        />
        {message && <div id="payment-message">{message}</div>}
      </div>
    );
  }

  // Render PaymentElement with centralized submit button
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
