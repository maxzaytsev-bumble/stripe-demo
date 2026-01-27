import { ReactNode, useState } from "react";
import styles from "./intents-with-custom-ui-components.module.css";

const CustomProviderUi = (props: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) => {
  const { label, isActive, onClick, children } = props;
  return (
    <div className={styles.item}>
      <button onClick={onClick}>{label}</button>
      <div style={{ display: isActive ? "block" : "none" }}>{children}</div>
    </div>
  );
};

const ProviderTypes = {
  CARD: "CARD",
  PAY_PAL: "PAY_PAL",
  APPLE_PAY: "APPLE_PAY",
} as const;

type ProviderType = (typeof ProviderTypes)[keyof typeof ProviderTypes];

const elementsToDisplayMap: Record<ProviderType, ReactNode> = {
  [ProviderTypes.CARD]: <div>card</div>,
  [ProviderTypes.PAY_PAL]: <div>paypal</div>,
  [ProviderTypes.APPLE_PAY]: <div>applepay</div>,
};

type ValueOf<T> = T[keyof T];

type CustomProvider = {
  id: ProviderType;
  label: string;
  content: ValueOf<typeof elementsToDisplayMap>;
};

const CUSTOM_PROVIDERS_LIST: CustomProvider[] = [
  {
    id: ProviderTypes.CARD,
    label: "Credit Card",
    content: elementsToDisplayMap[ProviderTypes.CARD],
  },
  {
    id: ProviderTypes.PAY_PAL,
    label: "PayPal",
    content: elementsToDisplayMap[ProviderTypes.PAY_PAL],
  },
  {
    id: ProviderTypes.APPLE_PAY,
    label: "ApplePay",
    content: elementsToDisplayMap[ProviderTypes.APPLE_PAY],
  },
];

export const IntentsWithCustomUiComponents = () => {
  const [selected, setSelected] = useState<ProviderType>(ProviderTypes.CARD);

  return (
    <div className={styles.root}>
      <h4>Payment providers</h4>
      {CUSTOM_PROVIDERS_LIST.map(({ label, content, id }) => {
        return (
          <CustomProviderUi
            label={label}
            key={label}
            isActive={selected === id}
            onClick={() => setSelected(id)}
          >
            {content}
          </CustomProviderUi>
        );
      })}
    </div>
  );
};
