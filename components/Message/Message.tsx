import React from "react";

interface MessageProps {
  message: string;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);
