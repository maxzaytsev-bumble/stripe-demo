"use client";

import React from "react";
import useSWR from "swr";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { type Product } from "@/lib/stripe";
import { fetcher } from "@/lib/fetcher";
import { formatPrice, formatInterval } from "@/lib/formatters";
import styles from "./ProductDisplay.module.css";

export const ProductDisplay = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useSWR<Product[]>("/api/products", fetcher);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No products available.</div>
      </div>
    );
  }

  // Separate products by type
  const subscriptions = products.filter((p) => p.type === "recurring");
  const oneTimeProducts = products.filter((p) => p.type === "one_time");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Plan</h1>
        <p className={styles.subtitle}>
          Start your journey to meaningful connections
        </p>
      </div>

      {subscriptions.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription Plans</h2>
          <div className={styles.productsGrid}>
            {subscriptions.map((product) => (
              <div key={product.id} className={styles.product}>
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
                <form
                  action="/api/create-checkout-session"
                  method="POST"
                  className={styles.form}
                >
                  <input
                    type="hidden"
                    name="price_id"
                    value={product.priceId}
                  />
                  <Button type="submit" fullWidth size="medium">
                    Checkout
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {oneTimeProducts.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>One-Time Purchases</h2>
          <div className={styles.productsGrid}>
            {oneTimeProducts.map((product) => (
              <div key={product.id} className={styles.product}>
                <div className={styles.logo}>
                  <Logo />
                </div>
                <div className={styles.description}>
                  <h3>{product.name}</h3>
                  <h5>{formatPrice(product.price, product.currency)}</h5>
                  {product.description && <p>{product.description}</p>}
                </div>
                <form
                  action="/api/create-checkout-session"
                  method="POST"
                  className={styles.form}
                >
                  <input
                    type="hidden"
                    name="price_id"
                    value={product.priceId}
                  />
                  <Button type="submit" fullWidth size="medium">
                    Checkout
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
