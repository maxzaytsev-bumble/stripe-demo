"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { type Product } from "@/lib/stripe";
import { formatPrice, formatInterval } from "@/lib/formatters";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("price_id", product.priceId);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
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
        <Button type="submit" fullWidth size="medium" disabled={isLoading}>
          {isLoading ? "Loading..." : "Checkout"}
        </Button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};
