import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

interface BaseButtonProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonAsLink extends BaseButtonProps {
  as: "link";
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = (props) => {
  const { children, fullWidth, size = "large", className } = props;

  const classNames = [
    styles.button,
    fullWidth && styles.fullWidth,
    size === "medium" && styles.medium,
    size === "small" && styles.small,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.as === "link") {
    return (
      <Link href={props.href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames}
    >
      {children}
    </button>
  );
};
