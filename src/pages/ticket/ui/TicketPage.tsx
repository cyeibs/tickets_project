import { TicketCard } from "@/shared/ui/TicketCard";
import styles from "./TicketPage.module.scss";
import { Button } from "@/shared/ui";
import QRCode from "react-qr-code";

const actualEvents = {
  id: 3,
  title: "VK fest",
  date: "5 июля 2025",
  time: "18:00",
  location: "Парк 300-летия Петербурга",
  status: "В оплате",
  imageUrl: "/tickets_project/avatars/1.webp",
  ticketId: "TICKET-VK-12345678",
};

export const TicketPage = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        <TicketCard
          title={actualEvents.title}
          date={actualEvents.date}
          location={actualEvents.location}
          time={actualEvents.time}
          imageUrl={actualEvents.imageUrl}
          image={true}
        />

        <div className={styles.qrCodeContainerWrapper}>
          <div className={styles.qrCodeContainer}>
            <QRCode
              value={actualEvents.ticketId}
              // size={}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
            <div className={styles.qrCodeLabel}>
              <span className={styles.qrCodeTitle}>Билет</span>
              <span className={styles.qrCodeId}>{actualEvents.ticketId}</span>
            </div>
          </div>
        </div>
        <div className={styles.detailsContainer}>
          <span className={styles.detailsTitle}>Детали заказа</span>
          <div className={styles.detailsContent}>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Номер заказа</span>
              <span className={styles.itemValue}>{actualEvents.ticketId}</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Билеты</span>
              <span className={styles.itemValue}>1000 ₽</span>
            </div>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Сервисный сбор</span>
              <span className={styles.itemValue}>100 ₽</span>
            </div>
          </div>
          <div className={styles.detailsSeparator} />
          <div className={styles.detailsItem}>
            <span className={styles.itemTitle}>Итого</span>
            <span className={styles.itemValue}>{1000 + 1000 * 0.1} ₽</span>
          </div>

          <div className={styles.buttonsContainer}>
            <Button className={styles.button}>Служба поддержки</Button>
            <Button className={styles.button}>Вернуть билет</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
