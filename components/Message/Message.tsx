import React from "react";
import styles from "./Message.module.css";

interface MessageProps {
  message: string;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <div className={styles.container}>
    <div className={styles.messageCard}>
      <p className={styles.message}>{message}</p>
    </div>
  </div>
);
