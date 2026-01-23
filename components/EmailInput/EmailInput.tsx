import React from "react";
import styles from "./EmailInput.module.css";

interface EmailInputProps {
  email: string;
  onChange: (email: string) => void;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  email,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.field}>
      <label htmlFor="email" className={styles.label}>
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@example.com"
        required
        className={styles.input}
        disabled={disabled}
      />
    </div>
  );
};
