import { formatInterval, formatPrice } from "@/lib/formatters";
import styles from "./Summary.module.css";

type Props = {
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

export const Summary = (props: Props) => {
  const { product, price } = props;

  if (!product || !price) {
    return null;
  }

  return (
    <div className={styles.purchaseSummary}>
      <div className={styles.iconWrapper}></div>
      <div className={styles.purchaseDetails}>
        <div className={styles.purchaseTitle}>
          <span className={styles.productName}>{product.name}</span>
          <span className={styles.purchasePrice}>
            {formatPrice(price.amount, price.currency)}
          </span>
        </div>
        {price.recurring && (
          <p className={styles.recurringInfo}>
            {formatPrice(price.amount, price.currency)}
            {" " +
              formatInterval(
                price.recurring.interval,
                price.recurring.interval_count,
              )}{" "}
            starting from the next renewal
          </p>
        )}
      </div>
    </div>
  );
};
