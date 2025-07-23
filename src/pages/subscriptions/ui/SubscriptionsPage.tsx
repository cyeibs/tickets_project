import styles from "./SubscriptionsPage.module.scss";
import { SubscriptionCard } from "@/shared/ui/SubscriptionCard";

const actualEvents = [
  {
    id: 3,
    title: "Путешествие в Оркестрбург: знакомство с ударными",
    date: "12 июня",
    time: "18:00",
    status: "В оплате",
    imageUrl: "./avatars/1.webp",
  },
  {
    id: 4,
    title: "Симфонический оркестр",
    date: "20 июня",
    time: "20:00",
    status: "Оплачено",
  },
];

const SubscriptionsPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        {actualEvents.map((event) => (
          <SubscriptionCard
            key={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            // status={event.status}
            imageUrl={event.imageUrl}
            image={!!event.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
