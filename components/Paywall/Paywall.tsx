"use client";

import React, { useState, useEffect } from "react";
import { ProductDisplay } from "@/components/ProductDisplay/ProductDisplay";
import { SuccessDisplay } from "@/components/SuccessDisplay/SuccessDisplay";
import { Message } from "@/components/Message/Message";

export function Paywall() {
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccess(true);
      setSessionId(query.get("session_id") || "");
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready.",
      );
    }
  }, [sessionId]);

  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}
