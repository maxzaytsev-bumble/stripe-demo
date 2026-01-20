import React from "react";
import { Logo } from "@/components/Logo/Logo";
import { BillingPortalForm } from "@/components/BillingPortalForm/BillingPortalForm";
import styles from "./SuccessDisplay.module.css";

interface SuccessDisplayProps {
  sessionId: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  sessionId,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.successIcon}>🎉</div>
        <h1 className={styles.title}>Welcome to Mumble!</h1>
        <p className={styles.subtitle}>
          Your subscription is now active. Start connecting with amazing people
          today!
        </p>
      </div>
      <BillingPortalForm sessionId={sessionId} />
    </div>
  );
};
