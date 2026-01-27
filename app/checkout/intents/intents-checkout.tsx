import {
  PaymentElement,
  useElements,
  useStripe,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { FormEventHandler, useState } from "react";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { IntentsWithCustomUiComponents } from "@/app/checkout/intents/intents-with-custom-ui-components";

// hard-coded by default
const FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED = Boolean(Math.random());

export const IntentsCheckout = ({ clientSecret }: { clientSecret: string }) => {
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
      return;
    }

    setIsLoading(true);

    try {
      if (FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED) {
        // Use confirmCardPayment for custom card elements
        const cardElement = elements.getElement(CardNumberElement);

        if (!cardElement) {
          setMessage("Card element not found");
          setIsLoading(false);
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          },
        );

        if (error) {
          setMessage(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          setMessage("Payment succeeded!");
          // Optionally redirect to success page
          window.location.href = "/complete";
        }
      } else {
        // Use confirmPayment for PaymentElement
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: "http://localhost:3000/complete",
          },
        });

        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setMessage(error.message || "Unknown error");
          } else {
            setMessage("An unexpected error occurred.");
          }
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

  const renderFormContent = () => {
    if (FEATURE_FLAG_CUSTOM_COMPONENTS_ENABLED) {
      return (
        <IntentsWithCustomUiComponents
          clientSecret={clientSecret}
          onProcessing={handleProcessing}
          onError={handleError}
        />
      );
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
