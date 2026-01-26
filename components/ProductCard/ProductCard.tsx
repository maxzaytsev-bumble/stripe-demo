"use client";

import React from "react";
import useSWRMutation from "swr/mutation";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { type Product, type PaymentIntentResponse } from "@/lib/types";
import { mutationFetcher } from "@/lib/fetcher";
import { formatPrice, formatInterval } from "@/lib/formatters";
import { useCustomCheckout } from "@/lib/feature-flags";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const customCheckoutEnabled = useCustomCheckout();

  const { trigger, isMutating, error } = useSWRMutation<
    PaymentIntentResponse,
    Error,
    string,
    FormData
  >("/api/create-payment-intent", mutationFetcher<PaymentIntentResponse>);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("price_id", product.priceId);

      // Add ui_mode parameter if custom checkout is enabled
      if (customCheckoutEnabled) {
        formData.append("ui_mode", "custom");
      }

      const response = await trigger(formData);

      window.location.href = `/checkout/intents?client_secret=${response.clientSecret}`;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className={styles.product}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.description}>
        <h3>{product.name}</h3>
        <h5>
          {formatPrice(product.price, product.currency)}{" "}
          {product.interval &&
            formatInterval(product.interval, product.intervalCount!)}
        </h5>
        {product.description && <p>{product.description}</p>}
      </div>
      <form onSubmit={handleCheckout} className={styles.form}>
        <Button type="submit" fullWidth size="medium" disabled={isMutating}>
          {isMutating ? "Loading..." : "Checkout"}
        </Button>
        {error && <p className={styles.error}>{error.message}</p>}
      </form>
    </div>
  );
};
