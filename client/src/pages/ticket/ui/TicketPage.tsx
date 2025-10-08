import { TicketCard } from "@/shared/ui/TicketCard";
import styles from "./TicketPage.module.scss";
import { Button } from "@/shared/ui";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user";

export const TicketPage = () => {
  const { id: ticketId } = useParams<{ id: string }>();

  const { data: ticket } = useQuery({
    queryKey: ["ticket", ticketId],
    enabled: !!ticketId,
    queryFn: () => userApi.getTicketById(ticketId!),
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.subscriptionsContainer}`}>
        <TicketCard
          title={ticket?.event.title || ""}
          date={ticket?.event.date}
          location={ticket?.event.location}
          time={ticket?.event.time}
          imageUrl={ticket?.event.imageUrl}
          image={!!ticket?.event.imageUrl}
        />

        <div className={styles.qrCodeContainerWrapper}>
          <div className={styles.qrCodeContainer}>
            <QRCode
              value={ticket?.code || ""}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
            <div className={styles.qrCodeLabel}>
              <span className={styles.qrCodeTitle}>Билет</span>
              <span className={styles.qrCodeId}>{ticket?.code}</span>
            </div>
          </div>
        </div>
        <div className={styles.detailsContainer}>
          <span className={styles.detailsTitle}>Детали заказа</span>
          <div className={styles.detailsContent}>
            <div className={styles.detailsItem}>
              <span className={styles.itemTitle}>Номер заказа</span>
              <span className={styles.itemValue}>{ticket?.orderNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
