"use client";

import React from "react";
import { Logo } from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { type Product } from "@/lib/stripe";
import { formatPrice, formatInterval } from "@/lib/formatters";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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
      <form
        action="/api/create-checkout-session"
        method="POST"
        className={styles.form}
      >
        <input type="hidden" name="price_id" value={product.priceId} />
        <Button type="submit" fullWidth size="medium">
          Checkout
        </Button>
      </form>
    </div>
  );
};
