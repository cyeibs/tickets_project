import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";
import styles from "./LegalDocs.module.scss";

const actualEvents = {
  id: 3,
  title: "Путешествие в Оркестрбург: знакомство с ударными",
  date: "12 июня",
  time: "18:00",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
};

export const LegalDocsPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.legalDocsContainer}`}>
        <SubscriptionCard
          title={actualEvents.title}
          date={actualEvents.date}
          time={actualEvents.time}
          imageUrl={actualEvents.imageUrl}
          image={true}
          isEdit
          hideContent
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <span className={styles.infoText}>ИНН</span>
            <div className={styles.infoText}>1230-021123</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>ИНН</span>
            <div className={styles.infoText}>1230-021123</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>ИНН</span>
            <div className={styles.infoText}>1230-021123</div>
          </div>
          <div className={styles.content}>
            <span className={styles.infoText}>ИНН</span>
            <div className={styles.infoText}>1230-021123</div>
          </div>
        </div>
      </div>
    </div>
  );
};
