import styles from "./Content.module.css";

export const Content = (props: { children: React.ReactNode }) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};
