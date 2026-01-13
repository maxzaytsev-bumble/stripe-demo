"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import styles from "./ProductDisplay.module.css";

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  priceId: string;
  price: number | null;
  currency: string;
  interval: string;
  intervalCount: number;
  lookupKey: string | null;
}

export const ProductDisplay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (amount: number | null, currency: string) => {
    if (amount === null) return "Free";
    const price = amount / 100;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(price);
  };

  const formatInterval = (interval: string, count: number) => {
    if (count === 1) {
      return `/ ${interval}`;
    }
    return `/ ${count} ${interval}s`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No products available.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Plan</h1>
        <p className={styles.subtitle}>
          Start your journey to meaningful connections
        </p>
      </div>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.product}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.description}>
              <h3>{product.name}</h3>
              <h5>
                {formatPrice(product.price, product.currency)}{" "}
                {formatInterval(product.interval, product.intervalCount)}
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
                name="lookup_key"
                value={product.lookupKey || product.priceId}
              />
              <Button type="submit" fullWidth size="medium">
                Checkout
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};
