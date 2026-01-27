import { ReactNode, useState } from "react";
import { CardForm } from "./payment-methods/CardForm";
import { PayPalForm } from "./payment-methods/PayPalForm";
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
      <button type="button" onClick={onClick}>
        {label}
      </button>
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

type CustomProvider = {
  id: ProviderType;
  label: string;
};

const CUSTOM_PROVIDERS_LIST: CustomProvider[] = [
  {
    id: ProviderTypes.CARD,
    label: "Credit Card",
  },
  {
    id: ProviderTypes.PAY_PAL,
    label: "PayPal",
  },
  {
    id: ProviderTypes.APPLE_PAY,
    label: "ApplePay",
  },
];

export const IntentsWithCustomUiComponents = ({
  clientSecret,
  onProcessing,
  onError,
}: {
  clientSecret: string;
  onProcessing: (isProcessing: boolean) => void;
  onError: (error: string) => void;
}) => {
  const [selected, setSelected] = useState<ProviderType>(ProviderTypes.CARD);

  const renderPaymentForm = (type: ProviderType) => {
    switch (type) {
      case ProviderTypes.CARD:
        return <CardForm />;
      case ProviderTypes.PAY_PAL:
        return (
          <PayPalForm
            clientSecret={clientSecret}
            onProcessing={onProcessing}
            onError={onError}
          />
        );
      case ProviderTypes.APPLE_PAY:
        return <div>Apple Pay integration coming soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      <h4>Payment providers</h4>
      {CUSTOM_PROVIDERS_LIST.map(({ label, id }) => {
        return (
          <CustomProviderUi
            label={label}
            key={label}
            isActive={selected === id}
            onClick={() => setSelected(id)}
          >
            {renderPaymentForm(id)}
          </CustomProviderUi>
        );
      })}
    </div>
  );
};
