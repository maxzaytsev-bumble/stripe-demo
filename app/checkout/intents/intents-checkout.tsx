import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEventHandler, useState } from "react";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

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

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="what-i-want-to-have">
        <h4>Payment providers</h4>
        <div className="payment-provider" id="pp-credit-card">
          render card here
        </div>
        <div className="payment-provider" id="pp-pay-pal">
          render PayPal here
        </div>
        <div className="payment-provider" id="pp-apple-pay">
          render ApplePay here
        </div>
        <div className="payment-provider" id="pp-google-pay">
          render GooglePay here
        </div>
        <div className="payment-provider" id="pp-ideal">
          render iDEAL here
        </div>
        <button>submit</button>
      </div>
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
