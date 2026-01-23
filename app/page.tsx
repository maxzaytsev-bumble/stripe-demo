import { Button } from "@/components/Button/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>BrandName</h1>
      </header>

      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>Find Your Perfect Match</h2>
        <p className={styles.heroSubtitle}>
          Join thousands of singles finding meaningful connections through
          BrandName. Where conversations lead to lasting relationships.
        </p>
        <Button as="link" href="/paywall">
          Get Started Today
        </Button>
      </section>

      <section className={styles.benefits}>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>💬</div>
          <h3 className={styles.benefitTitle}>Smart Matching</h3>
          <p className={styles.benefitDescription}>
            Our advanced algorithm connects you with compatible singles based on
            your interests and values.
          </p>
        </div>

        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>🔒</div>
          <h3 className={styles.benefitTitle}>Safe & Secure</h3>
          <p className={styles.benefitDescription}>
            Your privacy matters. Verified profiles and secure messaging keep
            you protected.
          </p>
        </div>

        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>❤️</div>
          <h3 className={styles.benefitTitle}>Real Connections</h3>
          <p className={styles.benefitDescription}>
            Build genuine relationships with people who share your passions and
            goals.
          </p>
        </div>

        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>✨</div>
          <h3 className={styles.benefitTitle}>Premium Features</h3>
          <p className={styles.benefitDescription}>
            Unlimited likes, advanced filters, and see who&#39;s interested in
            you.
          </p>
        </div>
      </section>
    </div>
  );
}
