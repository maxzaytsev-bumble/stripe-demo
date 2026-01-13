import React from "react";
import { Logo } from "@/components/Logo/Logo";

interface SuccessDisplayProps {
  sessionId: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  sessionId,
}) => {
  return (
    <section>
      <div className="product Box-root">
        <Logo />
        <div className="description Box-root">
          <h3>Subscription to Mumble Swipe successful!</h3>
        </div>
      </div>
      <form action="/api/create-portal-session" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  );
};
