import React from "react";
import { Logo } from "@/components/Logo/Logo";

export const ProductDisplay = () => (
  <section>
    <div className="product">
      <Logo />
      <div className="description">
        <h3>Mumble Swipe</h3>
        <h5>£2.00 / month</h5>
      </div>
    </div>
    <form action="/api/create-checkout-session" method="POST">
      {/* Add a hidden field with the lookup_key of your Price */}
      <input type="hidden" name="lookup_key" value="Mumble_Swipe-f22c221" />
      <button id="checkout-and-portal-button" type="submit">
        Checkout
      </button>
    </form>
  </section>
);
