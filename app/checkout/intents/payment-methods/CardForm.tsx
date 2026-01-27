import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
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

export const CardForm = () => {
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
    </div>
  );
};
