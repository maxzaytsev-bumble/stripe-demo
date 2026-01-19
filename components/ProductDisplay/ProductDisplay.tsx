"use client";

import React from "react";
import useSWR from "swr";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { type Product } from "@/lib/stripe";
import { fetcher } from "@/lib/fetcher";
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {oneTimeProducts.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>One-Time Purchases</h2>
          <div className={styles.productsGrid}>
            {oneTimeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
