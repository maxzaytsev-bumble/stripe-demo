import { Button } from "@/components/Button/Button";
import styles from "./BillingPortalForm.module.css";

type BillingPortalFormProps = {
  sessionId: string;
};

export function BillingPortalForm({ sessionId }: BillingPortalFormProps) {
  return (
    <form
      action="/api/create-portal-session"
      method="POST"
      className={styles.form}
    >
      <input
        type="hidden"
        id="session-id"
        name="session_id"
        value={sessionId}
      />
      <Button type="submit" fullWidth size="medium">
        Manage your billing information
      </Button>
    </form>
  );
}
